import { SaveSymbolsUseCase } from "./save-symbols";
import { mock } from "jest-mock-extended";
import { ISymbolRepository } from "../repositories/symbol.repository";
import { SymbolsNotFound } from "../exceptions/symbols-not-found.exception";
import { Symbol } from "../entities/symbol.entity";
import { SymbolNotFound } from "../exceptions/symbol-not-found.exception";
import { v4 as uuidv4 } from 'uuid';

const setupDependencies = () => {
	const symbolRepository = mock<ISymbolRepository>();
	return {
		symbolRepository,
	};
}; 

const getSymbol = (): Symbol => {
    const symbol = new Symbol();
    symbol.id = uuidv4();
    symbol.name = 'ABC';
    symbol.roe = 100;
    symbol.roePosition = 1;
    symbol.forwardPE = 10;
    symbol.forwardPEPosition = 1;
    symbol.ranking = 2;
    symbol.createdAt = new Date();
    symbol.updatedAt = new Date();
    symbol.reason = null;
    return symbol;
};

describe('SaveSymbolsUseCase', () => {
    let saveSymbolsUseCase: SaveSymbolsUseCase

    it('Should throws if not receive a symbol to save', async () => {
        const { symbolRepository } = setupDependencies();

        saveSymbolsUseCase = new SaveSymbolsUseCase(symbolRepository);

        await expect(saveSymbolsUseCase.handle(null)).rejects.toThrowError(new SymbolNotFound());
        expect(symbolRepository.findByName).not.toBeCalled();
        expect(symbolRepository.save).not.toBeCalled();
    });
    it('Should update a symbol if it already exists on repository', async () => {
        const { symbolRepository } = setupDependencies();

        const symbolFromDB = getSymbol();

        const symbol = new Symbol();
        symbol.name = 'ABC';
        symbol.roe = 90;
        symbol.forwardPE = 1000;

        const symbolToSave = Object.assign(symbol, symbolFromDB);

        symbolRepository.findByName.mockReturnValueOnce(Promise.resolve(symbolFromDB));

        saveSymbolsUseCase = new SaveSymbolsUseCase(symbolRepository);

        await saveSymbolsUseCase.handle(symbol);

        expect(symbolRepository.findByName).toBeCalledWith(symbol.name);
        expect(symbolRepository.save).toBeCalledTimes(1);
        expect(symbolRepository.save).toBeCalledWith(symbolToSave);
    });
    it('Should save a new symbol if not found a symbol into repository', async () => {
        const { symbolRepository } = setupDependencies();

        const symbol = new Symbol();
        symbol.name = 'ABC';
        symbol.roe = 90;
        symbol.forwardPE = 1000;

        symbolRepository.findByName.mockReturnValueOnce(Promise.resolve(null));

        saveSymbolsUseCase = new SaveSymbolsUseCase(symbolRepository);

        await saveSymbolsUseCase.handle(symbol);

        expect(symbolRepository.findByName).toBeCalledWith(symbol.name);
        expect(symbolRepository.save).toBeCalledTimes(1);
        expect(symbolRepository.save).toBeCalledWith(symbol);
    });
});

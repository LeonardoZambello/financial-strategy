import { SaveSymbolsUseCase } from "./save-symbols";
import { mock } from "jest-mock-extended";
import { ISymbolRepository } from "../repositories/symbol.repository";
import { SymbolsNotFound } from "../exceptions/symbols-not-found.exception";
import { Symbol } from "../entities/symbol.entity";

const setupDependencies = () => {
	const symbolRepository = mock<ISymbolRepository>();
	return {
		symbolRepository,
	};
}; 

describe('SaveSymbolsUseCase', () => {
    let saveSymbolsUseCase: SaveSymbolsUseCase

    it('Should save symbols with success', async () => {
        const symbolOne = new Symbol();
        symbolOne.name = 'AAAA5';

        const symbolTwo = new Symbol();
        symbolTwo.name = 'AAAA6';

        const symbols = new Array<Symbol>();
        symbols.push(symbolOne, symbolTwo)

        const { symbolRepository } = setupDependencies();

        saveSymbolsUseCase = new SaveSymbolsUseCase(symbolRepository);

        await saveSymbolsUseCase.handle(symbols);

        expect(symbolRepository.findByName).toBeCalledTimes(symbols.length);
        expect(symbolRepository.save).toBeCalledTimes(symbols.length);
    });
    it('Should throws if none symbols is provided', async () => {
        const { symbolRepository } = setupDependencies();

        saveSymbolsUseCase = new SaveSymbolsUseCase(symbolRepository);

        await expect(saveSymbolsUseCase.handle([])).rejects.toThrowError(new SymbolsNotFound());
        expect(symbolRepository.save).not.toBeCalled();
        expect(symbolRepository.findByName).not.toBeCalled();
    });
    it('Should save only symbols where name.length is equals to 5', async () => {
        const symbolOne = new Symbol();
        symbolOne.name = 'AAA4';

        const symbolTwo = new Symbol();
        symbolTwo.name = 'AAAA6';

        const symbols = new Array<Symbol>();
        symbols.push(symbolOne, symbolTwo)

        const { symbolRepository } = setupDependencies();

        saveSymbolsUseCase = new SaveSymbolsUseCase(symbolRepository);

        await saveSymbolsUseCase.handle(symbols);

        expect(symbolRepository.save).toBeCalledTimes(symbols.length - 1);
        expect(symbolRepository.findByName).toBeCalledTimes(symbols.length - 1);
    });
    it('Should not save a symbol duplicated', async () => {
        const symbolOne = new Symbol();
        symbolOne.name = 'AAAA6';

        const symbols = new Array<Symbol>();
        symbols.push(symbolOne)

        const { symbolRepository } = setupDependencies();

        symbolRepository.findByName.mockReturnValueOnce(Promise.resolve(symbolOne));

        saveSymbolsUseCase = new SaveSymbolsUseCase(symbolRepository);

        await saveSymbolsUseCase.handle(symbols);

        expect(symbolRepository.save).not.toBeCalled();
        expect(symbolRepository.findByName).toBeCalledTimes(symbols.length);
    });
});

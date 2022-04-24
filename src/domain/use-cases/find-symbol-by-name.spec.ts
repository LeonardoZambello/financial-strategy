import { mock } from "jest-mock-extended";
import { Symbol } from "../entities/symbol.entity";
import { InvalidSymbolName } from "../exceptions/invalid-symbol-name.exception";
import { SymbolNotFound } from "../exceptions/symbol-not-found.exception";
import { ISymbolRepository } from "../repositories/symbol.repository";
import { FindSymbolByNameUseCase } from "./find-symbol-by-name";

const setupDependencies = () => {
	const symbolRepository = mock<ISymbolRepository>();
	return {
		symbolRepository,
	};
};

const buildSymbol = (): Symbol => {
    const symbol = new Symbol();
    symbol.name = 'any_name';
    symbol.id = 'any_id';
    symbol.createdAt = new Date();
    symbol.updatedAt = new Date();
    symbol.forwardPE = 10;
    symbol.forwardPEPosition = 1;
    symbol.roe = 10;
    symbol.roePosition = 1;
    symbol.ranking = 1;
    symbol.reason = null;
    return symbol;
}

describe('FindSymbolByNameUseCase', () => {
    let findSymbolByNameUseCase: FindSymbolByNameUseCase;
    it('Should find a symbol by name with success', async () => {
        const { symbolRepository } = setupDependencies();

        const symbol = buildSymbol();

        symbolRepository.findByName.mockReturnValueOnce(Promise.resolve(symbol));        

        findSymbolByNameUseCase = new FindSymbolByNameUseCase(symbolRepository);

        const result = await findSymbolByNameUseCase.handle(symbol.name);

        expect(result).not.toBeNull();
        expect(result.id).toBe(symbol.id);
        expect(symbolRepository.findByName).toBeCalledWith(symbol.name);
    });
    it('Should throws if not receive a name', async () => {
        const { symbolRepository } = setupDependencies();

        findSymbolByNameUseCase = new FindSymbolByNameUseCase(symbolRepository);

        await expect(findSymbolByNameUseCase.handle(null)).rejects.toThrowError(new InvalidSymbolName());
        expect(symbolRepository.findByName).not.toBeCalled();
    });
    it('Should throws if not find a symbol', async () => {
        const { symbolRepository } = setupDependencies();

        const symbol = buildSymbol();

        symbolRepository.findByName.mockReturnValueOnce(Promise.resolve(null));

        findSymbolByNameUseCase = new FindSymbolByNameUseCase(symbolRepository);

        await expect(findSymbolByNameUseCase.handle(symbol.name)).rejects.toThrowError(new SymbolNotFound());
        expect(symbolRepository.findByName).toBeCalledWith(symbol.name);
    });
});

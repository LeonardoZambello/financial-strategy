import { mock } from "jest-mock-extended";
import { Symbol } from "../entities/symbol.entity";
import { InvalidSymbolName } from "../exceptions/invalid-symbol-name.exception";
import { SymbolNotFound } from "../exceptions/symbol-not-found.exception";
import { ISymbolRepository } from "../repositories/symbol.repository";
import { DeleteSymbolUseCase } from "./delete-symbol.use-case";

const setupDependencies = () => {
	const symbolRepository = mock<ISymbolRepository>();
	return {
		symbolRepository,
	};
}; 

describe('DeleteSymbolUseCase', () => {
    let deleteSymbolUseCase: DeleteSymbolUseCase;
    it('Should throws if not receive a name to delete', async () => {
        const { symbolRepository } = setupDependencies();

        deleteSymbolUseCase = new DeleteSymbolUseCase(symbolRepository);

        await expect(deleteSymbolUseCase.handle(null)).rejects.toThrowError(new InvalidSymbolName());
        expect(symbolRepository.findByName).not.toBeCalled();
        expect(symbolRepository.delete).not.toBeCalled();
    });
    it('Should throws if not found a symbol to delete', async () => {
        const { symbolRepository } = setupDependencies();

        deleteSymbolUseCase = new DeleteSymbolUseCase(symbolRepository);

        const symbolName = 'ABC';

        await expect(deleteSymbolUseCase.handle(symbolName)).rejects.toThrowError(new SymbolNotFound());
        expect(symbolRepository.findByName).toBeCalledWith(symbolName);
        expect(symbolRepository.delete).not.toBeCalled();
    });
    it('Should delete a symbol with success', async () => {
        const { symbolRepository } = setupDependencies();

        const symbolName = 'ABC';

        const symbol = new Symbol();
        symbol.name = symbolName;

        symbolRepository.findByName.mockReturnValueOnce(Promise.resolve(symbol));        

        deleteSymbolUseCase = new DeleteSymbolUseCase(symbolRepository);

        await deleteSymbolUseCase.handle(symbolName);

        expect(symbolRepository.findByName).toBeCalledWith(symbolName);
        expect(symbolRepository.delete).toBeCalledWith(symbolName);
    });
});

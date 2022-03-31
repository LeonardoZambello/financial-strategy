import { mock } from "jest-mock-extended";
import { Symbol } from "../entities/symbol.entity";
import { ISymbolRepository } from "../repositories/symbol.repository";
import { PaginationVO } from "../value_objects/pagination.value-object";
import { FindAllSymbolsUseCase } from "./find-all-symbols.use-case";

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

const buildPaginationVO = (): PaginationVO => {
    const paginationVO = new PaginationVO();
    paginationVO.limit = '25';
    paginationVO.skip = '5';
    paginationVO.roe = null;
    paginationVO.forwardPE = null;
    return paginationVO;
}

describe('FindAllSymbolsUseCase', () => {
    let findAllSymbolsUseCase: FindAllSymbolsUseCase;
    it('Should return an array of symbols', async () => {
        const { symbolRepository } = setupDependencies();

        const symbols = new Array<Symbol>();
        const symbol = buildSymbol();
        symbols.push(symbol);

        symbolRepository.findAll.mockReturnValueOnce(Promise.resolve(symbols));

        findAllSymbolsUseCase = new FindAllSymbolsUseCase(symbolRepository);

        const paginationVO = buildPaginationVO();

        const result = await findAllSymbolsUseCase.handle(paginationVO);

        expect(result.length).toBe(1);
        expect(symbolRepository.findAll).toBeCalledWith(paginationVO);
    });
});

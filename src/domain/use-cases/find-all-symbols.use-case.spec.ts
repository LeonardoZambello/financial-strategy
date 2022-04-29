import { mock } from "jest-mock-extended";
import { OrderEnum } from "../entities/order.enum";
import { SortOptionsEnum } from "../entities/sort-options.enum";
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
    paginationVO.page = 2;
    paginationVO.size = 7;
    paginationVO.sort = SortOptionsEnum.RANKING_PE;
    paginationVO.order = OrderEnum.DESC;
    return paginationVO;
}

describe('FindAllSymbolsUseCase', () => {
    let findAllSymbolsUseCase: FindAllSymbolsUseCase;
    it('Should return an array of symbols', async () => {
        const { symbolRepository } = setupDependencies();

        const symbols = new Array<Symbol>();
        const symbol = buildSymbol();
        symbols.push(symbol);

        symbolRepository.findAll.mockReturnValueOnce(Promise.resolve([symbols, 15]));

        findAllSymbolsUseCase = new FindAllSymbolsUseCase(symbolRepository);

        const paginationVO = buildPaginationVO();

        const [result, count] = await findAllSymbolsUseCase.handle(paginationVO);

        expect(result.length).toBe(1);
        expect(count).toBe(15);
        expect(symbolRepository.findAll).toBeCalledWith(paginationVO);
    });
});

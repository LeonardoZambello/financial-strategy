import { mock } from "jest-mock-extended";
import { OrderEnum } from "../entities/order.enum";
import { SortOptionsEnum } from "../entities/sort-options.enum";
import { Stock } from "../entities/stock.entity";
import { IStockRepository } from "../repositories/symbol.repository";
import { PaginationVO } from "../value_objects/pagination.value-object";
import { FindAllStocksUseCase } from "./find-all-stocks.use-case";

const setupDependencies = () => {
	const stockRepository = mock<IStockRepository>();
	return {
		stockRepository,
	};
};

const buildStock = (): Stock => {
    const stock = new Stock();
    stock.name = 'any_name';
    stock.symbol = 'any_symbol';
    stock.id = 'any_id';
    stock.createdAt = new Date();
    stock.updatedAt = new Date();
    stock.forwardPE = 10;
    stock.forwardPEPosition = 1;
    stock.roe = 10;
    stock.roePosition = 1;
    stock.ranking = 1;
    stock.reason = null;
    return stock;
}

const buildPaginationVO = (): PaginationVO => {
    const paginationVO = new PaginationVO();
    paginationVO.page = 2;
    paginationVO.size = 7;
    paginationVO.sort = SortOptionsEnum.RANKING_PE;
    paginationVO.order = OrderEnum.DESC;
    return paginationVO;
}

describe('FindAllStocksUseCase', () => {
    let findAllStocksUseCase: FindAllStocksUseCase;
    it('Should return an array of symbols', async () => {
        const { stockRepository } = setupDependencies();

        const stocks = new Array<Stock>();
        const stock = buildStock();
        stocks.push(stock);

        stockRepository.findAll.mockReturnValueOnce(Promise.resolve([stocks, 15]));

        findAllStocksUseCase = new FindAllStocksUseCase(stockRepository);

        const paginationVO = buildPaginationVO();

        const [result, count] = await findAllStocksUseCase.handle(paginationVO);

        expect(result.length).toBe(1);
        expect(count).toBe(15);
        expect(stockRepository.findAll).toBeCalledWith(paginationVO);
    });
});

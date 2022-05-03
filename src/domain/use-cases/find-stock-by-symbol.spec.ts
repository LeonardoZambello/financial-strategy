import { mock } from "jest-mock-extended";
import { Stock } from "../entities/stock.entity";
import { InvalidStockName } from "../exceptions/invalid-stock-name.exception";
import { StockNotFound } from "../exceptions/stock-not-found.exception";
import { IStockRepository } from "../repositories/symbol.repository";
import { FindStockBySymbolUseCase } from "./find-stock-by-symbol";

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

describe('FindStockBySymbolUseCase', () => {
    let findStockBySymbolUseCase: FindStockBySymbolUseCase;
    it('Should find a stock by symbol with success', async () => {
        const { stockRepository } = setupDependencies();

        const stock = buildStock();

        stockRepository.findBySymbol.mockReturnValueOnce(Promise.resolve(stock));        

        findStockBySymbolUseCase = new FindStockBySymbolUseCase(stockRepository);

        const result = await findStockBySymbolUseCase.handle(stock.symbol);

        expect(result).not.toBeNull();
        expect(result.id).toBe(stock.id);
        expect(stockRepository.findBySymbol).toBeCalledWith(stock.symbol);
    });
    it('Should throws if not receive a symbol', async () => {
        const { stockRepository } = setupDependencies();

        findStockBySymbolUseCase = new FindStockBySymbolUseCase(stockRepository);

        await expect(findStockBySymbolUseCase.handle(null)).rejects.toThrowError(new InvalidStockName());
        expect(stockRepository.findBySymbol).not.toBeCalled();
    });
    it('Should throws if not find a stock', async () => {
        const { stockRepository } = setupDependencies();

        const stock = buildStock();

        stockRepository.findBySymbol.mockReturnValueOnce(Promise.resolve(null));

        findStockBySymbolUseCase = new FindStockBySymbolUseCase(stockRepository);

        await expect(findStockBySymbolUseCase.handle(stock.symbol)).rejects.toThrowError(new StockNotFound());
        expect(stockRepository.findBySymbol).toBeCalledWith(stock.symbol);
    });
});

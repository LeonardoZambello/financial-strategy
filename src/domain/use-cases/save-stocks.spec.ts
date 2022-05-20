import { SaveStockUseCase } from "./save-stocks";
import { mock } from "jest-mock-extended";
import { IStockRepository } from "../repositories/symbol.repository";
import { Stock } from "../entities/stock.entity";
import { StockNotFound } from "../exceptions/stock-not-found.exception";
import { v4 as uuidv4 } from 'uuid';

const setupDependencies = () => {
	const stockRepository = mock<IStockRepository>();
	return {
		stockRepository,
	};
}; 

const getStock = (): Stock => {
    const stock = new Stock();
    stock.id = uuidv4();
    stock.name = 'ABC';
    stock.symbol = 'DEF';
    stock.roe = 100;
    stock.roePosition = 1;
    stock.forwardPE = 10;
    stock.forwardPEPosition = 1;
    stock.ranking = 2;
    stock.createdAt = new Date();
    stock.updatedAt = new Date();
    stock.reason = null;
    return stock;
};

describe('SaveStockUseCase', () => {
    let saveStockUseCase: SaveStockUseCase

    it('Should throws if not receive a stock to save', async () => {
        const { stockRepository } = setupDependencies();

        saveStockUseCase = new SaveStockUseCase(stockRepository);

        await expect(saveStockUseCase.handle(null)).rejects.toThrowError(new StockNotFound());
        expect(stockRepository.findBySymbol).not.toBeCalled();
        expect(stockRepository.save).not.toBeCalled();
    });
    it('Should update a stock if it already exists on repository', async () => {
        const { stockRepository } = setupDependencies();

        const stockFromDB = getStock();

        const stock = new Stock();
        stock.name = 'ABC';
        stock.symbol = 'DEF';
        stock.roe = 90;
        stock.forwardPE = 1000;

        const stockToSave = Object.assign(stock, stockFromDB);

        stockRepository.findBySymbol.mockReturnValueOnce(Promise.resolve(stockFromDB));

        saveStockUseCase = new SaveStockUseCase(stockRepository);

        await saveStockUseCase.handle(stock);

        expect(stockRepository.findBySymbol).toBeCalledWith(stock.symbol);
        expect(stockRepository.save).toBeCalledTimes(1);
        expect(stockRepository.save).toBeCalledWith(stockToSave);
    });
    it('Should save a new symbol if not found a symbol into repository', async () => {
        const { stockRepository } = setupDependencies();

        const stock = new Stock();
        stock.name = 'ABC';
        stock.symbol = 'DEF';
        stock.roe = 90;
        stock.forwardPE = 1000;

        stockRepository.findBySymbol.mockReturnValueOnce(Promise.resolve(null));

        saveStockUseCase = new SaveStockUseCase(stockRepository);

        await saveStockUseCase.handle(stock);

        expect(stockRepository.findBySymbol).toBeCalledWith(stock.symbol);
        expect(stockRepository.save).toBeCalledTimes(1);
        expect(stockRepository.save).toBeCalledWith(stock);
    });
});

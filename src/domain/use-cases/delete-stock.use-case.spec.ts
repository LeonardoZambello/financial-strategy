import { mock } from "jest-mock-extended";
import { Stock } from "../entities/stock.entity";
import { InvalidStockName } from "../exceptions/invalid-stock-name.exception";
import { StockNotFound } from "../exceptions/stock-not-found.exception";
import { IStockRepository } from "../repositories/symbol.repository";
import { DeleteStockUseCase } from "./delete-stock.use-case";

const setupDependencies = () => {
	const stockRepository = mock<IStockRepository>();
	return {
		stockRepository,
	};
}; 

describe('DeleteStockUseCase', () => {
    let deleteStockUseCase: DeleteStockUseCase;
    it('Should throws if not receive a symbol to delete', async () => {
        const { stockRepository } = setupDependencies();

        deleteStockUseCase = new DeleteStockUseCase(stockRepository);

        await expect(deleteStockUseCase.handle(null)).rejects.toThrowError(new InvalidStockName());
        expect(stockRepository.findBySymbol).not.toBeCalled();
        expect(stockRepository.delete).not.toBeCalled();
    });
    it('Should throws if not found a stock to delete', async () => {
        const { stockRepository } = setupDependencies();

        deleteStockUseCase = new DeleteStockUseCase(stockRepository);

        const stockSymbol = 'ABC';

        await expect(deleteStockUseCase.handle(stockSymbol)).rejects.toThrowError(new StockNotFound());
        expect(stockRepository.findBySymbol).toBeCalledWith(stockSymbol);
        expect(stockRepository.delete).not.toBeCalled();
    });
    it('Should delete a stock with success', async () => {
        const { stockRepository } = setupDependencies();

        const stockSymbol = 'ABC';

        const stock = new Stock();
        stock.symbol = stockSymbol;

        stockRepository.findBySymbol.mockReturnValueOnce(Promise.resolve(stock));        

        deleteStockUseCase = new DeleteStockUseCase(stockRepository);

        await deleteStockUseCase.handle(stockSymbol);

        expect(stockRepository.findBySymbol).toBeCalledWith(stockSymbol);
        expect(stockRepository.delete).toBeCalledWith(stockSymbol);
    });
});

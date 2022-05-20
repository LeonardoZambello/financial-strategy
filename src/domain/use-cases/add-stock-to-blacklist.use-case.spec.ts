import { mock } from "jest-mock-extended";
import { Stock } from "../entities/stock.entity";
import { InvalidStockName } from "../exceptions/invalid-stock-name.exception";
import { StockAlreadyBlacklisted } from "../exceptions/stock-is-already-blacklisted.exception";
import { StockNotFound } from "../exceptions/stock-not-found.exception";
import { IStockRepository } from "../repositories/symbol.repository";
import { AddStockToBlacklistUseCase } from "./add-stock-to-blacklist.use-case";

const setupDependencies = () => {
	const stockRepository = mock<IStockRepository>();
	return {
		stockRepository,
	};
}; 

describe('AddStockToBlacklistUseCase', () => {
    let addStockToBlacklistUseCase: AddStockToBlacklistUseCase;
    it('Should throws if not receive a symbol to add a blacklist', async () => {
        const { stockRepository } = setupDependencies();

        addStockToBlacklistUseCase = new AddStockToBlacklistUseCase(stockRepository);

        await expect(addStockToBlacklistUseCase.handle(null)).rejects.toThrowError(new InvalidStockName());
        expect(stockRepository.findBySymbol).not.toBeCalled();
        expect(stockRepository.save).not.toBeCalled();
    });
    it('Should throws if not found a stock to add a blacklist', async () => {
        const { stockRepository } = setupDependencies();

        addStockToBlacklistUseCase = new AddStockToBlacklistUseCase(stockRepository);

        const stockSymbol = 'ABC';

        await expect(addStockToBlacklistUseCase.handle(stockSymbol)).rejects.toThrowError(new StockNotFound());
        expect(stockRepository.findBySymbol).toBeCalledWith(stockSymbol);
        expect(stockRepository.save).not.toBeCalled();
    });
    it('Should throws if try to add a stock to blacklist if it is already blacklisted', async () => {
        const { stockRepository } = setupDependencies();

        const stockSymbol = 'ABC';

        const stock = new Stock();
        stock.symbol = stockSymbol;
        stock.blacklistedAt = new Date();

        stockRepository.findBySymbol.mockReturnValueOnce(Promise.resolve(stock));        

        addStockToBlacklistUseCase = new AddStockToBlacklistUseCase(stockRepository);

        await expect(addStockToBlacklistUseCase.handle(stockSymbol)).rejects.toThrowError(new StockAlreadyBlacklisted());
        expect(stockRepository.findBySymbol).toBeCalledWith(stockSymbol);
        expect(stockRepository.save).not.toBeCalled();
    });
    it('Should add a stock to blacklist with success', async () => {
        const { stockRepository } = setupDependencies();

        const stockSymbol = 'ABC';

        const stock = new Stock();
        stock.symbol = stockSymbol;

        stockRepository.findBySymbol.mockReturnValueOnce(Promise.resolve(stock));        

        addStockToBlacklistUseCase = new AddStockToBlacklistUseCase(stockRepository);

        await addStockToBlacklistUseCase.handle(stockSymbol);

        expect(stockRepository.findBySymbol).toBeCalledWith(stockSymbol);
        expect(stock.blacklistedAt).not.toBeUndefined();
        expect(stockRepository.save).toBeCalledTimes(1);
    });
});

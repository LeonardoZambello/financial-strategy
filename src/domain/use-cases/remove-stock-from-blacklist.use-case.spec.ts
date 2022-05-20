import { mock } from "jest-mock-extended";
import { Stock } from "../entities/stock.entity";
import { InvalidStockName } from "../exceptions/invalid-stock-name.exception";
import { StockIsNotBlacklisted } from "../exceptions/stock-is-not-blacklisted.excepetion";
import { StockNotFound } from "../exceptions/stock-not-found.exception";
import { IStockRepository } from "../repositories/symbol.repository";
import { AddStockToBlacklistUseCase } from "./add-stock-to-blacklist.use-case";
import { RemoveStockFromBlacklistUseCase } from "./remove-stock-from-blacklist.use-case";

const setupDependencies = () => {
	const stockRepository = mock<IStockRepository>();
	return {
		stockRepository,
	};
}; 

describe('RemoveStockFromBlacklistUseCase', () => {
    let removeStockFromBlacklistUseCase: RemoveStockFromBlacklistUseCase;
    it('Should throws if not receive a symbol to remove from blacklist', async () => {
        const { stockRepository } = setupDependencies();

        removeStockFromBlacklistUseCase = new RemoveStockFromBlacklistUseCase(stockRepository);

        await expect(removeStockFromBlacklistUseCase.handle(null)).rejects.toThrowError(new InvalidStockName());
        expect(stockRepository.findBySymbol).not.toBeCalled();
        expect(stockRepository.save).not.toBeCalled();
    });
    it('Should throws if not found a stock to remove from blacklist', async () => {
        const { stockRepository } = setupDependencies();

        removeStockFromBlacklistUseCase = new RemoveStockFromBlacklistUseCase(stockRepository);

        const stockSymbol = 'ABC';

        await expect(removeStockFromBlacklistUseCase.handle(stockSymbol)).rejects.toThrowError(new StockNotFound());
        expect(stockRepository.findBySymbol).toBeCalledWith(stockSymbol);
        expect(stockRepository.save).not.toBeCalled();
    });
    it('Should throws if try to remove a stock from blacklist if it is not blacklisted', async () => {
        const { stockRepository } = setupDependencies();

        const stockSymbol = 'ABC';

        const stock = new Stock();
        stock.symbol = stockSymbol;

        stockRepository.findBySymbol.mockReturnValueOnce(Promise.resolve(stock));        

        removeStockFromBlacklistUseCase = new RemoveStockFromBlacklistUseCase(stockRepository);

        await expect(removeStockFromBlacklistUseCase.handle(stockSymbol)).rejects.toThrowError(new StockIsNotBlacklisted());
        expect(stockRepository.findBySymbol).toBeCalledWith(stockSymbol);
        expect(stockRepository.save).not.toBeCalled();
    });
    it('Should remove a stock from blacklist with success', async () => {
        const { stockRepository } = setupDependencies();

        const stockSymbol = 'ABC';

        const stock = new Stock();
        stock.symbol = stockSymbol;
        stock.blacklistedAt = new Date();

        stockRepository.findBySymbol.mockReturnValueOnce(Promise.resolve(stock));        

        removeStockFromBlacklistUseCase = new RemoveStockFromBlacklistUseCase(stockRepository);

        await removeStockFromBlacklistUseCase.handle(stockSymbol);

        expect(stockRepository.findBySymbol).toBeCalledWith(stockSymbol);
        expect(stock.blacklistedAt).toBeNull()
        expect(stockRepository.save).toBeCalledTimes(1);
    });
});

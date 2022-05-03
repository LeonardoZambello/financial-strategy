import { mock } from "jest-mock-extended";
import { Stock } from "../../domain/entities/stock.entity";
import { StockRepository } from "../persistence/postgres/repositories/stock.repository";
import { RankStocksJob } from "./rank-stocks.job";

const createStock = (name: string, symbol: string, roe: number, forwardPE: number): Stock => {
    const stock = new Stock();
    stock.id = '123';
    stock.name = name;
    stock.symbol = symbol;
    stock.roe = roe;
    stock.createdAt = new Date();
    stock.updatedAt = new Date();
    stock.forwardPE = forwardPE;
    stock.reason = null;
    return stock;
}

const setupDependencies = () => {
    const stockRepository = mock<StockRepository>();
	return {
        stockRepository,
	};
}; 

describe('RankStocksJob', () => {
    it('Should rank stocks by roe if exists', async () => {
        const { stockRepository } = setupDependencies();

        const stocksWithROE = new Array<Stock>();
        const stockOne = createStock('XXXX6', 'ANYSYMBOL1', 98, 1);
        const stockTwo = createStock('XXXX5', 'ANYSYMBOL2', 10, 100);
        stocksWithROE.push(stockOne, stockTwo);

        stockRepository.findStocksWithROE.mockReturnValueOnce(Promise.resolve(stocksWithROE));

        stockRepository.findStocksWithForwardPE.mockReturnValueOnce(Promise.resolve([]));

        stockRepository.findStocksWithNegativeForwardPE.mockReturnValueOnce(Promise.resolve([]));

        stockRepository.findStocksWithROEAndForwardPE.mockReturnValueOnce(Promise.resolve([]));

        const rankStocksJob = new RankStocksJob(stockRepository);

        await rankStocksJob.handle();

        expect(stockRepository.saveAll).toBeCalledTimes(1);
        expect(stockOne.roePosition).toBe(1);
        expect(stockTwo.roePosition).toBe(2);
    });
    it('Should rank stocks by forwardPE if exists', async () => {
        const { stockRepository } = setupDependencies();

        const stocksWithForwardPE = new Array<Stock>();
        const stockOne = createStock('XXXX6', 'ANYSYMBOL1', 98, 1);
        const stockTwo = createStock('XXXX5', 'ANYSYMBOL2', 10, 100);
        stocksWithForwardPE.push(stockOne, stockTwo);

        stockRepository.findStocksWithROE.mockReturnValueOnce(Promise.resolve([]));

        stockRepository.findStocksWithForwardPE.mockReturnValueOnce(Promise.resolve(stocksWithForwardPE));

        stockRepository.findStocksWithNegativeForwardPE.mockReturnValueOnce(Promise.resolve([]));

        stockRepository.findStocksWithROEAndForwardPE.mockReturnValueOnce(Promise.resolve([]));

        const rankStocksJob = new RankStocksJob(stockRepository);

        await rankStocksJob.handle();

        expect(stockRepository.saveAll).toBeCalledTimes(1);
        expect(stockOne.forwardPEPosition).toBe(1);
        expect(stockTwo.forwardPEPosition).toBe(2);
    });
    it('Should rank stocks by negative forwardPE if exists', async () => {
        const { stockRepository } = setupDependencies();

        const stocksWithForwardPE = new Array<Stock>();
        const stockOne = createStock('XXXX6', 'ANYSYMBOL1', 98, -1);
        const stockTwo = createStock('XXXX5', 'ANYSYMBOL2', 10, -100);
        stocksWithForwardPE.push(stockOne, stockTwo);

        stockRepository.findStocksWithROE.mockReturnValueOnce(Promise.resolve([]));

        stockRepository.findStocksWithForwardPE.mockReturnValueOnce(Promise.resolve([]));

        stockRepository.findStocksWithNegativeForwardPE.mockReturnValueOnce(Promise.resolve(stocksWithForwardPE));

        stockRepository.findStocksWithROEAndForwardPE.mockReturnValueOnce(Promise.resolve([]));

        const rankStocksJob = new RankStocksJob(stockRepository);

        await rankStocksJob.handle();

        expect(stockRepository.saveAll).toBeCalledTimes(1);
        expect(stockOne.forwardPEPosition).toBe(1);
        expect(stockTwo.forwardPEPosition).toBe(2);
    });
    it('Should rank stocks if forwardPE and roe exists', async () => {
        const { stockRepository } = setupDependencies();

        const stocksToRank = new Array<Stock>();

        const stockOne = createStock('XXXX6', 'ANYSYMBOL1', 98, 1);
        stockOne.roePosition = 1;
        stockOne.forwardPEPosition = 1;

        const stockTwo = createStock('XXXX5', 'ANYSYMBOL1', 10, 100);
        stockTwo.roePosition = 2;
        stockTwo.forwardPEPosition = 2;

        stocksToRank.push(stockOne, stockTwo);

        stockRepository.findStocksWithROE.mockReturnValueOnce(Promise.resolve([]));

        stockRepository.findStocksWithForwardPE.mockReturnValueOnce(Promise.resolve([]));

        stockRepository.findStocksWithNegativeForwardPE.mockReturnValueOnce(Promise.resolve([]));

        stockRepository.findStocksWithROEAndForwardPE.mockReturnValueOnce(Promise.resolve(stocksToRank));

        const rankStocksJob = new RankStocksJob(stockRepository);

        await rankStocksJob.handle();

        expect(stockRepository.saveAll).toBeCalledTimes(1);
        expect(stockOne.ranking).toBe(2);
        expect(stockTwo.ranking).toBe(4);
    });
});

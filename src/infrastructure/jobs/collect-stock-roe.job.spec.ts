import { mock } from "jest-mock-extended";
import { Stock } from "../../domain/entities/stock.entity";
import { YahooFinanceAPICliente } from "../api-client/yahoo-finance.api-client";
import { StockRepository } from "../persistence/postgres/repositories/stock.repository";
import { CollectStockROEJob } from "./collect-stock-roe.job";

const setupDependencies = () => {
    const stockRepository = mock<StockRepository>();
	const yahooFinanceAPICliente = mock<YahooFinanceAPICliente>();
	return {
        stockRepository,
		yahooFinanceAPICliente
	};
}; 

describe('CollectStockROEJob', () => {
    it('Should collect stock roe with success', async () => {
        process.env.ENABLE_JOB_ROE = 'true'
        const {  stockRepository, yahooFinanceAPICliente } = setupDependencies();

        const collectStockROEJob = new CollectStockROEJob(stockRepository, yahooFinanceAPICliente);

        const stocks = new Array<Stock>();

        const stockOne = new Stock();
        stockOne.name = 'AAAA5';
        stockOne.symbol = 'ANYSYMBOL1'

        const stockTwo = new Stock();
        stockTwo.name = 'AAAA6';
        stockTwo.symbol = 'ANYSYMBOL2';

        stocks.push(stockOne, stockTwo);

        stockRepository.findStocksWithOutROE.mockReturnValueOnce(Promise.resolve(stocks));

        yahooFinanceAPICliente.collectROE.mockReturnValue(Promise.resolve(10));

        await collectStockROEJob.handle();

        expect(stockRepository.findStocksWithOutROE).toBeCalledTimes(1);
        expect(yahooFinanceAPICliente.collectROE).toBeCalledTimes(stocks.length);
        expect(stockRepository.save).toBeCalledTimes(stocks.length);
        expect(stockOne.roe).toBe(10);
        expect(stockTwo.roe).toBe(10);
    });
    it('Should not collect stock roe if none symbol was found', async () => {
        process.env.ENABLE_JOB_ROE = 'true'
        const {  stockRepository ,yahooFinanceAPICliente } = setupDependencies();

        const collectStockROEJob = new CollectStockROEJob(stockRepository, yahooFinanceAPICliente);

        stockRepository.findStocksWithOutROE.mockReturnValueOnce(Promise.resolve([]));

        await collectStockROEJob.handle();

        expect(stockRepository.findStocksWithOutROE).toBeCalledTimes(1);
        expect(yahooFinanceAPICliente.collectROE).not.toBeCalled();
        expect(stockRepository.save).not.toBeCalled();
    });
    it('Should not collect stock roe if symbol name is invalid', async () => {
        process.env.ENABLE_JOB_ROE = 'true'
        const {  stockRepository, yahooFinanceAPICliente } = setupDependencies();

        const collectStockROEJob = new CollectStockROEJob(stockRepository, yahooFinanceAPICliente);

        const stocks = new Array<Stock>();

        const stock = new Stock();
        stock.name = 'AAAA5';
        stock.symbol = 'ANYSYMBOL'

        stocks.push(stock);

        stockRepository.findStocksWithOutROE.mockReturnValueOnce(Promise.resolve(stocks));

        yahooFinanceAPICliente.collectROE.mockReturnValueOnce(Promise.resolve(null));

        await collectStockROEJob.handle();

        expect(stockRepository.findStocksWithOutROE).toBeCalledTimes(1);
        expect(yahooFinanceAPICliente.collectROE).toBeCalledTimes(stocks.length);
        expect(stockRepository.save).toBeCalledTimes(stocks.length);
        expect(stock.reason).toBe('Stock not found in Yahoo API');
    });
    it('Should not save stock roe if Yahoo API finance throws', async () => {
        process.env.ENABLE_JOB_ROE = 'true'
        const {  stockRepository, yahooFinanceAPICliente } = setupDependencies();

        const collectStockROEJob = new CollectStockROEJob(stockRepository, yahooFinanceAPICliente);

        const stocks = new Array<Stock>();

        const stock = new Stock();
        stock.name = 'AAAA5';
        stock.symbol = 'ANYSYMBOL'

        stocks.push(stock);

        stockRepository.findStocksWithOutROE.mockReturnValueOnce(Promise.resolve(stocks));

        yahooFinanceAPICliente.collectROE.mockReturnValueOnce(Promise.reject('Error status code: 429'));

        await expect(collectStockROEJob.handle()).rejects.toBe('Error status code: 429');
        expect(stock.reason).toBeUndefined();
        expect(stock.roe).toBeUndefined();
        expect(stockRepository.save).not.toBeCalled();
    });
    it('Should only execute job if env ENABLE_JOB_ROE is "true"', async () => {
        process.env.ENABLE_JOB_ROE = 'false'

        const {  stockRepository ,yahooFinanceAPICliente } = setupDependencies();

        const collectStockROEJob = new CollectStockROEJob(stockRepository, yahooFinanceAPICliente);

        await collectStockROEJob.handle();

        expect(stockRepository.findStocksWithOutROE).not.toBeCalled();
        expect(yahooFinanceAPICliente.collectROE).not.toBeCalled();
        expect(stockRepository.save).not.toBeCalled();
    });
});

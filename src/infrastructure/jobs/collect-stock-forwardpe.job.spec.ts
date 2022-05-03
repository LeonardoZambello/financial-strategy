import { mock } from "jest-mock-extended";
import { Stock } from "../../domain/entities/stock.entity";
import { YahooFinanceAPICliente } from "../api-client/yahoo-finance.api-client";
import { StockRepository } from "../persistence/postgres/repositories/stock.repository";
import { CollectStockForwardPEJob } from "./collect-stock-forwardpe.job";

const setupDependencies = () => {
    const stockRepository = mock<StockRepository>();
	const yahooFinanceAPICliente = mock<YahooFinanceAPICliente>();
	return {
        stockRepository,
		yahooFinanceAPICliente
	};
}; 

describe('CollectStockForwardPEJob', () => {
    it('Should collect stock forwardPE with success', async () => {
        process.env.ENABLE_JOB_FORWARDPE = 'true'
        const {  stockRepository ,yahooFinanceAPICliente } = setupDependencies();

        const collectStockForwardPEJob = new CollectStockForwardPEJob(stockRepository, yahooFinanceAPICliente);

        const stocks = new Array<Stock>();

        const stockOne = new Stock();
        stockOne.name = 'AAAA5';
        stockOne.symbol = 'ANYSYMBOL1';

        const stockTwo = new Stock();
        stockTwo.name = 'AAAA6';
        stockTwo.symbol = 'ANYSYMBOL2';

        stocks.push(stockOne, stockTwo);

        stockRepository.findStocksWithOutForwardPE.mockReturnValueOnce(Promise.resolve(stocks));

        yahooFinanceAPICliente.collectForwardPE.mockReturnValue(Promise.resolve(10));

        await collectStockForwardPEJob.handle();

        expect(stockRepository.findStocksWithOutForwardPE).toBeCalledTimes(1);
        expect(yahooFinanceAPICliente.collectForwardPE).toBeCalledTimes(stocks.length);
        expect(stockRepository.save).toBeCalledTimes(stocks.length);
        expect(stockOne.forwardPE).toBe(10);
        expect(stockTwo.forwardPE).toBe(10);
    });
    it('Should not collect stock forwardPE if none stock was found', async () => {
        process.env.ENABLE_JOB_FORWARDPE = 'true'
        const {  stockRepository ,yahooFinanceAPICliente } = setupDependencies();

        const collectStockForwardPEJob = new CollectStockForwardPEJob(stockRepository, yahooFinanceAPICliente);

        stockRepository.findStocksWithOutForwardPE.mockReturnValueOnce(Promise.resolve([]));

        await collectStockForwardPEJob.handle();

        expect(stockRepository.findStocksWithOutForwardPE).toBeCalledTimes(1);
        expect(yahooFinanceAPICliente.collectForwardPE).not.toBeCalled();
        expect(stockRepository.save).not.toBeCalled();
    });
    it('Should not collect stock forwardPE if stock name is invalid', async () => {
        process.env.ENABLE_JOB_FORWARDPE = 'true'
        const {  stockRepository ,yahooFinanceAPICliente } = setupDependencies();

        const collectStockForwardPEJob = new CollectStockForwardPEJob(stockRepository, yahooFinanceAPICliente);

        const stocks = new Array<Stock>();

        const stock = new Stock();
        stock.name = 'AAAA5';
        stock.symbol = 'ANYSYMBOL2';

        stocks.push(stock);

        stockRepository.findStocksWithOutForwardPE.mockReturnValueOnce(Promise.resolve(stocks));

        yahooFinanceAPICliente.collectForwardPE.mockReturnValueOnce(Promise.resolve(null));

        await collectStockForwardPEJob.handle();

        expect(stockRepository.findStocksWithOutForwardPE).toBeCalledTimes(1);
        expect(yahooFinanceAPICliente.collectForwardPE).toBeCalledTimes(stocks.length);
        expect(stockRepository.save).toBeCalledTimes(stocks.length);
        expect(stock.reason).toBe('Stock not found in Yahoo API');
    });
    it('Should not save stock forwardPE if Yahoo API finance throws', async () => {
        process.env.ENABLE_JOB_FORWARDPE = 'true'
        const {  stockRepository, yahooFinanceAPICliente } = setupDependencies();

        const collectStockForwardPEJob = new CollectStockForwardPEJob(stockRepository, yahooFinanceAPICliente);

        const stocks = new Array<Stock>();

        const stock = new Stock();
        stock.name = 'AAAA5';
        stock.symbol = 'ANYSYMBOL2';

        stocks.push(stock);

        stockRepository.findStocksWithOutForwardPE.mockReturnValueOnce(Promise.resolve(stocks));

        yahooFinanceAPICliente.collectForwardPE.mockReturnValueOnce(Promise.reject('Error status code: 429'));

        await expect(collectStockForwardPEJob.handle()).rejects.toBe('Error status code: 429');
        expect(stock.reason).toBeUndefined();
        expect(stock.forwardPE).toBeUndefined();
        expect(stockRepository.save).not.toBeCalled();
    });
    it('Should only execute job if env ENABLE_JOB_FORWARDPE is "true"', async () => {
        process.env.ENABLE_JOB_FORWARDPE = 'false'

        const {  stockRepository ,yahooFinanceAPICliente } = setupDependencies();

        const collectStockForwardPEJob = new CollectStockForwardPEJob(stockRepository, yahooFinanceAPICliente);

        await collectStockForwardPEJob.handle();

        expect(stockRepository.findStocksWithOutForwardPE).not.toBeCalled();
        expect(yahooFinanceAPICliente.collectForwardPE).not.toBeCalled();
        expect(stockRepository.save).not.toBeCalled();
    });
});

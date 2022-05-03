import { mock } from "jest-mock-extended";
import { IStockDataCollector } from "../collector/stock-data.collector";
import { Stock } from "../entities/stock.entity";
import { IStockRepository } from "../repositories/symbol.repository";
import { CollectAndUpdateStocksValuesUseCase } from "./collect-and-update-stocks-values.use-case";
import { v4 as uuidv4 } from 'uuid';

const setupDependencies = () => {
    const stockDataCollector = mock<IStockDataCollector>();
    const stockRepository = mock<IStockRepository>();
    return {
        stockDataCollector,
        stockRepository,
    };
};

describe('CollectAndUpdateStocksValuesUseCase', () => {
    let collectAndUpdateStocksValuesUseCase: CollectAndUpdateStocksValuesUseCase;
    it('Should collect data and create/update stocks with new values', async () => {
        const { stockDataCollector, stockRepository } = setupDependencies();

        const stocks = new Array<Stock>();

        const stockOne = new Stock();
        stockOne.symbol = 'ABC';
        stockOne.roe = 100;
        stockOne.forwardPE = 100;

        const stockTwo = new Stock();
        stockTwo.symbol = 'DEF';
        stockTwo.roe = 50;
        stockTwo.forwardPE = 50;

        stocks.push(stockOne, stockTwo);

        stockDataCollector.collectData.mockReturnValueOnce(Promise.resolve(stocks));

        collectAndUpdateStocksValuesUseCase = new CollectAndUpdateStocksValuesUseCase(stockDataCollector, stockRepository);

        await collectAndUpdateStocksValuesUseCase.handle();

        expect(stockRepository.findBySymbol).toBeCalledTimes(stocks.length);
        expect(stockRepository.save).toBeCalledTimes(stocks.length);
    });
    it('Should update a symbol with new values collected', async () => {
        const { stockDataCollector, stockRepository } = setupDependencies();

        const stocks = new Array<Stock>();

        const stockOne = new Stock();
        stockOne.symbol = 'ABC';
        stockOne.roe = 100;
        stockOne.forwardPE = 100;

        stocks.push(stockOne);

        stockDataCollector.collectData.mockReturnValueOnce(Promise.resolve(stocks));

        const stockFromDB = new Stock();
        stockFromDB.id = uuidv4();
        stockFromDB.name = 'ABC';
        stockFromDB.roe = 100;
        stockFromDB.roePosition = 1;
        stockFromDB.forwardPE = 10;
        stockFromDB.forwardPEPosition = 1;
        stockFromDB.ranking = 2;
        stockFromDB.createdAt = new Date();
        stockFromDB.updatedAt = new Date();
        stockFromDB.reason = null;
        stockFromDB.symbol = 'DEF';

        const stockToUpdate = Object.assign(stockFromDB, stockOne);

        stockRepository.findBySymbol.mockReturnValueOnce(Promise.resolve(stockFromDB));

        collectAndUpdateStocksValuesUseCase = new CollectAndUpdateStocksValuesUseCase(stockDataCollector, stockRepository);

        await collectAndUpdateStocksValuesUseCase.handle();

        expect(stockRepository.findBySymbol).toBeCalledWith(stockOne.symbol)
        expect(stockRepository.save).toBeCalledWith(stockToUpdate);
    });
});

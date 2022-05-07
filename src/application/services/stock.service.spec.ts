import { mock } from "jest-mock-extended";
import { Stock } from "../../domain/entities/stock.entity";
import { FindStockBySymbolUseCase } from "../../domain/use-cases/find-stock-by-symbol";
import { SaveStockUseCase } from "../../domain/use-cases/save-stocks";
import { StockNameListDTO } from "../dto/stock-name-list.dto";
import { StockMapper } from "../mappers/stock.mapper";
import { StockService } from "./stock.service";
import { v4 as uuidv4 } from 'uuid';
import { FindStockBySymbolDTO } from "../dto/find-stock-by-name.dto";
import { Request } from 'express';
import { FindAllStocksUseCase } from "../../domain/use-cases/find-all-stocks.use-case";
import { DeleteStockUseCase } from "../../domain/use-cases/delete-stock.use-case";
import { CollectAndUpdateStocksValuesUseCase } from "../../domain/use-cases/collect-and-update-stocks-values.use-case";
import { CreateOrUpdateStockDTO } from "../dto/create-or-update-stock.dto";
import { RequiredQueryStrings } from "../rest/query-strings/required-query-strings";
import { RankingStockDTO } from "../dto/ranking-stock.dto";

const getStockNameListDTO = () => {
    const stockNameListDTO = new StockNameListDTO();
    
    stockNameListDTO.names = ['AAAA5', 'AAAA6'];

    return stockNameListDTO;
}

const getCreateOrUpdateStockDTO = (changes = null): CreateOrUpdateStockDTO => {
    const createOrUpdateStockDTO = new CreateOrUpdateStockDTO();
    
    createOrUpdateStockDTO.name = 'ABC';
    createOrUpdateStockDTO.PE = 100;
    createOrUpdateStockDTO.roe = 1;

    return Object.assign(createOrUpdateStockDTO, changes);
} 

const setupDependencies = () => {
	const saveStockUseCase = mock<SaveStockUseCase>();
    const findStockBySymbolUseCase = mock<FindStockBySymbolUseCase>();
    const stockMapper = mock<StockMapper>();
    const findAllStocksUseCase = mock<FindAllStocksUseCase>();
    const deleteStockUseCase = mock<DeleteStockUseCase>();
    const collectAndUpdateStocksValuesUseCase = mock<CollectAndUpdateStocksValuesUseCase>();
    const request = mock<Request>();
	return {
		saveStockUseCase,
        findStockBySymbolUseCase,
        findAllStocksUseCase,
        deleteStockUseCase,
        collectAndUpdateStocksValuesUseCase,
        stockMapper,
        request
	};
}; 

const getStock = (): Stock => {
    
    const stock = new Stock();
    stock.id = uuidv4();
    stock.name = 'ANYNAME';
    stock.symbol = 'ANYSYMBOL';
    stock.forwardPE = 10;
    stock.forwardPEPosition = 1;
    stock.roe = 10;
    stock.roePosition = 1;
    stock.ranking = 1;
    stock.createdAt = new Date();
    stock.updatedAt = new Date();
    stock.reason = null;
    return stock;
}

const getFindStockBySymbolDTO = (stock: Stock): FindStockBySymbolDTO => {
    const findStockBySymbolDTO = new FindStockBySymbolDTO();
    findStockBySymbolDTO.id = stock.id;
    findStockBySymbolDTO.name = stock.name;
    findStockBySymbolDTO.symbol = stock.symbol;
    findStockBySymbolDTO.forwardPE = stock.forwardPE;
    findStockBySymbolDTO.roe = stock.roe;
    findStockBySymbolDTO.ranking = stock.ranking;
    findStockBySymbolDTO.reason = stock.reason;
    return findStockBySymbolDTO;
};

describe('StockService', () => {
    it('Should return null if a invalid dto is provided', async () => {
        const stockNameList = null;

        const { saveStockUseCase, findStockBySymbolUseCase, findAllStocksUseCase, deleteStockUseCase, collectAndUpdateStocksValuesUseCase, stockMapper, request } = setupDependencies();

        const stockService = new StockService(saveStockUseCase, findStockBySymbolUseCase, findAllStocksUseCase, deleteStockUseCase, collectAndUpdateStocksValuesUseCase, stockMapper, request);

        const result = await stockService.save(stockNameList);

        expect(result).toBeNull();
        expect(stockMapper.createDTOtoDomain).not.toBeCalled();
        expect(saveStockUseCase.handle).not.toBeCalled();
    });
    it('Should save a list of stocks if valid data is provided', async () => {
        const dto = getCreateOrUpdateStockDTO();

        const { saveStockUseCase, findStockBySymbolUseCase, findAllStocksUseCase, deleteStockUseCase, collectAndUpdateStocksValuesUseCase, stockMapper, request } = setupDependencies();

        const stockService = new StockService(saveStockUseCase, findStockBySymbolUseCase, findAllStocksUseCase, deleteStockUseCase, collectAndUpdateStocksValuesUseCase, stockMapper, request);

        await stockService.save(dto);

        expect(stockMapper.createDTOtoDomain).toBeCalledTimes(1);
        expect(stockMapper.createDTOtoDomain).toBeCalledWith(dto);
        expect(saveStockUseCase.handle).toBeCalledTimes(1);
    });
    it('Should return null if try to find a stock by symbol and receive a null symbol', async () => {
        const name = null;

        const { saveStockUseCase, findStockBySymbolUseCase, findAllStocksUseCase, deleteStockUseCase, collectAndUpdateStocksValuesUseCase, stockMapper, request } = setupDependencies();

        const stockService = new StockService(saveStockUseCase, findStockBySymbolUseCase, findAllStocksUseCase, deleteStockUseCase, collectAndUpdateStocksValuesUseCase, stockMapper, request);

        const result = await stockService.findStockBySymbol(name);

        expect(result).toBeNull();
        expect(findStockBySymbolUseCase.handle).not.toBeCalled();
        expect(stockMapper.createDomainToDTO).not.toBeCalled();
    });
    it('Should return a stock filtering by provided symbol', async () => {
        const symbol = 'ANYSYMBOL';

        const stock = getStock();

        const { saveStockUseCase, findStockBySymbolUseCase, findAllStocksUseCase, deleteStockUseCase, collectAndUpdateStocksValuesUseCase, stockMapper, request } = setupDependencies();

        findStockBySymbolUseCase.handle.mockReturnValueOnce(Promise.resolve(stock));

        stockMapper.createDomainToDTO.mockReturnValueOnce(getFindStockBySymbolDTO(stock));

        const stockService = new StockService(saveStockUseCase, findStockBySymbolUseCase, findAllStocksUseCase, deleteStockUseCase, collectAndUpdateStocksValuesUseCase, stockMapper, request);

        const result = await stockService.findStockBySymbol(symbol);

        expect(result.id).toBe(stock.id);
        expect(result.name).toBe(stock.name);
        expect(result.forwardPE).toBe(stock.forwardPE);
        expect(result.roe).toBe(stock.roe);
        expect(result.ranking).toBe(stock.ranking);
        expect(result.reason).toBe(stock.reason);
        expect(result.symbol).toBe(stock.symbol);
        expect(findStockBySymbolUseCase.handle).toBeCalledWith(symbol);
        expect(stockMapper.createDomainToDTO).toBeCalledWith(stock);
    });
    it('Shold find stocks with pagination parameters with success', async () => {
        const { saveStockUseCase, findStockBySymbolUseCase, findAllStocksUseCase, deleteStockUseCase, collectAndUpdateStocksValuesUseCase, stockMapper, request } = setupDependencies();

        const query = new RequiredQueryStrings();
        query.size = 7;
        const stocks = new Array<Stock>();
        stocks.push(getStock());
        stocks.push(getStock());
        stocks.push(getStock());
        const mockCount = 15;

        findAllStocksUseCase.handle.mockReturnValueOnce(Promise.resolve([stocks, mockCount]));

        stockMapper.createDomainToRankingDTO.mockReturnValueOnce(new RankingStockDTO());

        const stockService = new StockService(saveStockUseCase, findStockBySymbolUseCase, findAllStocksUseCase, deleteStockUseCase, collectAndUpdateStocksValuesUseCase, stockMapper, request);

        const [result, count, pageCount] = await stockService.findAllSymbols(query);

        expect(result.length).toBe(3);
        expect(count).toBe(15);
        expect(pageCount).toBe(3);
        expect(findAllStocksUseCase.handle).toBeCalledTimes(1);
        expect(stockMapper.createDomainToRankingDTO).toBeCalledTimes(stocks.length);
    });
    it('Should return empty if not found stocks with pagination parameters', async () => {
        const { saveStockUseCase, findStockBySymbolUseCase, findAllStocksUseCase, deleteStockUseCase, collectAndUpdateStocksValuesUseCase, stockMapper, request } = setupDependencies();

        const query = new RequiredQueryStrings();
        const mockCount = 0;

        findAllStocksUseCase.handle.mockReturnValueOnce(Promise.resolve([[], mockCount]));

        const stockService = new StockService(saveStockUseCase, findStockBySymbolUseCase, findAllStocksUseCase, deleteStockUseCase, collectAndUpdateStocksValuesUseCase, stockMapper, request);

        const [result, count, pageCount] = await stockService.findAllSymbols(query);

        expect(result).not.toBeNull();
        expect(result.length).toBe(0);
        expect(count).toBe(0);
        expect(pageCount).toBe(0);
        expect(findAllStocksUseCase.handle).toBeCalledTimes(1);
        expect(stockMapper.createDomainToDTO).not.toBeCalled();
    });
    it('Should return null if not receive a symbol to delete stock', async () => {
        const { saveStockUseCase, findStockBySymbolUseCase, findAllStocksUseCase, deleteStockUseCase, collectAndUpdateStocksValuesUseCase, stockMapper, request } = setupDependencies();

        const stockService = new StockService(saveStockUseCase, findStockBySymbolUseCase, findAllStocksUseCase, deleteStockUseCase, collectAndUpdateStocksValuesUseCase, stockMapper, request);

        const result = await stockService.delete(null);

        expect(result).toBeNull();
    });
    it('Should delete a stock with success', async () => {
        const { saveStockUseCase, findStockBySymbolUseCase, findAllStocksUseCase, deleteStockUseCase, collectAndUpdateStocksValuesUseCase, stockMapper, request } = setupDependencies();

        const stockService = new StockService(saveStockUseCase, findStockBySymbolUseCase, findAllStocksUseCase, deleteStockUseCase, collectAndUpdateStocksValuesUseCase, stockMapper, request);

        const stockSymbol = 'ABCD';

        await stockService.delete(stockSymbol);

        expect(deleteStockUseCase.handle).toBeCalledWith(stockSymbol);
    });
    it('Should create or update a stock with success', async () => {
        const { saveStockUseCase, findStockBySymbolUseCase, findAllStocksUseCase, deleteStockUseCase, collectAndUpdateStocksValuesUseCase, stockMapper, request } = setupDependencies();

        const stockService = new StockService(saveStockUseCase, findStockBySymbolUseCase, findAllStocksUseCase, deleteStockUseCase, collectAndUpdateStocksValuesUseCase, stockMapper, request);

        await stockService.createOrUpdateStocks();

        expect(collectAndUpdateStocksValuesUseCase.handle).toBeCalledTimes(1);
    });
});

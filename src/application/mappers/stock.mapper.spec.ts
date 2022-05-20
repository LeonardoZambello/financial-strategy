import { Stock } from "../../domain/entities/stock.entity";
import { StockNameListDTO } from "../dto/stock-name-list.dto";
import { StockMapper } from "./stock.mapper";
import { v4 as uuidv4 } from 'uuid';
import { CreateOrUpdateStockDTO } from "../dto/create-or-update-stock.dto";

const getStockNameListDTO = (): StockNameListDTO => {
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

const getStock = (): Stock => {
    const stock = new Stock();
    stock.id = uuidv4();
    stock.name = 'ANYNAME';
    stock.symbol = 'ANYSYMBOL'
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

describe('StockMapper', () => {
    it('Should return a null stock', () => {
        const stockMapper = new StockMapper();

        const stock = stockMapper.createDTOtoDomain(null);

        expect(stock).toBeNull();
    });
    it('Should return a Stock domain entity', () => {
        const dto = getCreateOrUpdateStockDTO();

        const stockMapper = new StockMapper();

        const stock = stockMapper.createDTOtoDomain(dto);

        expect(stock.name).toBe(dto.name);
        expect(stock.roe).toBe(dto.roe);
        expect(stock.forwardPE).toBe(dto.PE);
    });
    it('Should return a FindStockByNameDTO', () => {
        const stock = getStock();

        const stockMapper = new StockMapper();

        const dto = stockMapper.createDomainToDTO(stock);

        expect(dto.id).toBe(stock.id);
        expect(dto.name).toBe(stock.name);
        expect(dto.forwardPE).toBe(stock.forwardPE);
        expect(dto.roe).toBe(stock.roe);
        expect(dto.ranking).toBe(stock.ranking);
        expect(dto.reason).toBe(stock.reason);
        expect(dto.symbol).toBe(stock.symbol);
    });
    it('Should return a RankingStockDTO', () => {
        const stock = getStock();

        const stockMapper = new StockMapper();

        const dto = stockMapper.createDomainToRankingDTO(stock);

        expect(dto.symbol).toBe(stock.symbol);
        expect(dto.ranking).toBe(stock.ranking);
        expect(dto.rankingRoe).toBe(stock.roePosition);
        expect(dto.rankingPE).toBe(stock.forwardPEPosition);
        expect(dto.roe).toBe(stock.roe);
        expect(dto.forwardPE).toBe(stock.forwardPE);
        expect(dto.updatedAt).toBe(stock.updatedAt);
        expect(dto.name).toBe(stock.name);
    });
});

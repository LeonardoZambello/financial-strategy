import { Symbol } from "../../domain/entities/symbol.entity";
import { SymbolNameListDTO } from "../dto/symbol-name-list.dto";
import { SymbolMapper } from "./symbol.mapper";
import { v4 as uuidv4 } from 'uuid';
import { CreateOrUpdateSymbolDTO } from "../dto/create-or-update-symbol.dto";

const getSymbolNameListDTO = (): SymbolNameListDTO => {
    const symbolNameListDTO = new SymbolNameListDTO();
    
    symbolNameListDTO.names = ['AAAA5', 'AAAA6'];

    return symbolNameListDTO;
}

const getCreateOrUpdateSymbolDTO = (changes = null): CreateOrUpdateSymbolDTO => {
    const createOrUpdateSymbolDTO = new CreateOrUpdateSymbolDTO();
    
    createOrUpdateSymbolDTO.name = 'ABC';
    createOrUpdateSymbolDTO.PE = 100;
    createOrUpdateSymbolDTO.roe = 1;

    return Object.assign(createOrUpdateSymbolDTO, changes);
} 

const getSymbol = (): Symbol => {
    const symbol = new Symbol();
    symbol.id = uuidv4();
    symbol.name = 'ANYNAME';
    symbol.forwardPE = 10;
    symbol.forwardPEPosition = 1;
    symbol.roe = 10;
    symbol.roePosition = 1;
    symbol.ranking = 1;
    symbol.createdAt = new Date();
    symbol.updatedAt = new Date();
    symbol.reason = null;
    return symbol;
}

describe('SymbolMapper', () => {
    it('Should return a null symbol', () => {
        const symbolMapper = new SymbolMapper();

        const symbol = symbolMapper.createDTOtoDomain(null);

        expect(symbol).toBeNull();
    });
    it('Should return a Symbol domain entity', () => {
        const dto = getCreateOrUpdateSymbolDTO();

        const symbolMapper = new SymbolMapper();

        const symbol = symbolMapper.createDTOtoDomain(dto);

        expect(symbol.name).toBe(dto.name);
        expect(symbol.roe).toBe(dto.roe);
        expect(symbol.forwardPE).toBe(dto.PE);
    });
    it('Should return a FindSymbolByNameDTO', () => {
        const symbol = getSymbol();

        const symbolMapper = new SymbolMapper();

        const dto = symbolMapper.createDomainToDTO(symbol);

        expect(dto.id).toBe(symbol.id);
        expect(dto.name).toBe(symbol.name);
        expect(dto.forwardPE).toBe(symbol.forwardPE);
        expect(dto.roe).toBe(symbol.roe);
        expect(dto.ranking).toBe(symbol.ranking);
        expect(dto.reason).toBe(symbol.reason);
    });
    it('Should return a RankingSymbolDTO', () => {
        const symbol = getSymbol();

        const symbolMapper = new SymbolMapper();

        const dto = symbolMapper.createDomainToRankingDTO(symbol);

        expect(dto.symbol).toBe(symbol.name);
        expect(dto.ranking).toBe(symbol.ranking);
        expect(dto.rankingRoe).toBe(symbol.roePosition);
        expect(dto.rankingPE).toBe(symbol.forwardPEPosition);
        expect(dto.roe).toBe(symbol.roe);
        expect(dto.forwardPE).toBe(symbol.forwardPE);
        expect(dto.updatedAt).toBe(symbol.updatedAt);
    });
});

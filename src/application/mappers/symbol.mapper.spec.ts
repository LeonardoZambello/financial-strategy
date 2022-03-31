import { Symbol } from "../../domain/entities/symbol.entity";
import { SymbolNameListDTO } from "../dto/symbol-name-list.dto";
import { SymbolMapper } from "./symbol.mapper";
import { v4 as uuidv4 } from 'uuid';

const getSymbolNameListDTO = (): SymbolNameListDTO => {
    const symbolNameListDTO = new SymbolNameListDTO();
    
    symbolNameListDTO.names = ['AAAA5', 'AAAA6'];

    return symbolNameListDTO;
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
        const dto = getSymbolNameListDTO();

        const symbolMapper = new SymbolMapper();

        const symbols = symbolMapper.createDTOtoDomain(dto);

        expect(symbols.length).toBe(dto.names.length);
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
});

import { SymbolNameListDTO } from "../dto/symbol-name-list.dto";
import { SymbolMapper } from "./symbol.mapper";

const getSymbolNameListDTO = () => {
    const symbolNameListDTO = new SymbolNameListDTO();
    
    symbolNameListDTO.names = ['AAAA5', 'AAAA6'];

    return symbolNameListDTO;
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
});

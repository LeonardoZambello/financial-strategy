import 'reflect-metadata';
import { SymbolNameListDTO } from "./symbol-name-list.dto";
import { validate } from 'class-validator';

const getSymbolNameListDTO = (changes = null) => {
    const symbolNameListDTO = new SymbolNameListDTO();
    
    symbolNameListDTO.names = ['AAAA5', 'AAAA6'];

    return Object.assign(symbolNameListDTO, changes);
}

describe('SymbolNameListDTO', () => {
    it.only('Should validate if list is null', async () => {
        const dto = getSymbolNameListDTO({ names: null });

        const result = await validate(dto);

        expect(result.length).toBe(1);
        expect(result[0].property).toBe('names');
        expect(result[0].constraints['arrayNotEmpty']).not.toBeUndefined();
    });
    it('Should validate if any name is not a string', async () => {
        const dto = getSymbolNameListDTO({ names: [123] });

        const result = await validate(dto);

        expect(result.length).toBe(1);
        expect(result[0].property).toBe('names');
        expect(result[0].constraints['isString']).not.toBeUndefined();
    });
    it('Should validate if list is empty', async () => {
        const dto = getSymbolNameListDTO({ names: [] });

        const result = await validate(dto);
        
        expect(result.length).toBe(1);
        expect(result[0].property).toBe('names');
        expect(result[0].constraints['arrayNotEmpty']).not.toBeUndefined();
    });
});

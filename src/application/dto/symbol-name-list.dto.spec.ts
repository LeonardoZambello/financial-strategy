import 'reflect-metadata';
import { SymbolNameListDTO } from "./symbol-name-list.dto";
import { validate } from 'class-validator';

const getSymbolNameListDTO = (changes = null) => {
    const symbolNameListDTO = new SymbolNameListDTO();
    
    symbolNameListDTO.names = ['AAAA5', 'AAAA6'];

    return Object.assign(symbolNameListDTO, changes);
}

describe('SymbolNameListDTO', () => {
    it('Should validate if list is null', async () => {
        const dto = getSymbolNameListDTO({ names: null });

        const result = await validate(dto);

        expect(result.length).toBe(1);
        expect(result[0].property).toBe('names');
        expect(result[0].constraints['isLength']).not.toBeUndefined();
    });
    it('Should validate if any name has length different of 5', async () => {
        const dto = getSymbolNameListDTO({ names: ['AAA4'] });

        const result = await validate(dto);

        expect(result.length).toBe(1);
        expect(result[0].property).toBe('names');
        expect(result[0].constraints['isLength']).not.toBeUndefined();
    });
    it('Should validate if list is empty', async () => {
        const dto = getSymbolNameListDTO({ names: [] });

        const result = await validate(dto);

        expect(result.length).toBe(1);
        expect(result[0].property).toBe('names');
        expect(result[0].constraints['isNotEmptyObject']).not.toBeUndefined();
    });
});

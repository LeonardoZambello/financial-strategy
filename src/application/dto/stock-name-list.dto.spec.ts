import 'reflect-metadata';
import { StockNameListDTO } from "./stock-name-list.dto";
import { validate } from 'class-validator';

const getStockNameListDTO = (changes = null) => {
    const stockNameListDTO = new StockNameListDTO();
    
    stockNameListDTO.names = ['AAAA5', 'AAAA6'];

    return Object.assign(stockNameListDTO, changes);
}

describe('StockNameListDTO', () => {
    it('Should validate if list is null', async () => {
        const dto = getStockNameListDTO({ names: null });

        const result = await validate(dto);

        expect(result.length).toBe(1);
        expect(result[0].property).toBe('names');
        expect(result[0].constraints['arrayNotEmpty']).not.toBeUndefined();
    });
    it('Should validate if any name is not a string', async () => {
        const dto = getStockNameListDTO({ names: [123] });

        const result = await validate(dto);

        expect(result.length).toBe(1);
        expect(result[0].property).toBe('names');
        expect(result[0].constraints['isString']).not.toBeUndefined();
    });
    it('Should validate if list is empty', async () => {
        const dto = getStockNameListDTO({ names: [] });

        const result = await validate(dto);
        
        expect(result.length).toBe(1);
        expect(result[0].property).toBe('names');
        expect(result[0].constraints['arrayNotEmpty']).not.toBeUndefined();
    });
});

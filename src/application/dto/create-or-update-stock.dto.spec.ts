import 'reflect-metadata';
import { CreateOrUpdateStockDTO } from "./create-or-update-stock.dto";
import { validate } from 'class-validator';

const getCreateOrUpdateStockDTO = (changes = null) => {
    const createOrUpdateStockDTO = new CreateOrUpdateStockDTO();
    
    createOrUpdateStockDTO.name = 'ABC';
    createOrUpdateStockDTO.PE = 100;
    createOrUpdateStockDTO.roe = 1;
    createOrUpdateStockDTO.symbol = 'DEF';

    return Object.assign(createOrUpdateStockDTO, changes);
}

describe('CreateOrUpdateStockDTO', () => {
    it('Should validate if name is empty', async () => {
        const dto = getCreateOrUpdateStockDTO({ name: null });

        const result = await validate(dto);

        expect(result.length).toBe(1);
        expect(result[0].property).toBe('name');
        expect(result[0].constraints['isNotEmpty']).not.toBeUndefined();
    });
    it('Should validate if name is not a string', async () => {
        const dto = getCreateOrUpdateStockDTO({ name: 123 });

        const result = await validate(dto);

        expect(result.length).toBe(1);
        expect(result[0].property).toBe('name');
        expect(result[0].constraints['isString']).not.toBeUndefined();
    });
    it('Should validate if symbol is empty', async () => {
        const dto = getCreateOrUpdateStockDTO({ symbol: null });

        const result = await validate(dto);

        expect(result.length).toBe(1);
        expect(result[0].property).toBe('symbol');
        expect(result[0].constraints['isNotEmpty']).not.toBeUndefined();
    });
    it('Should validate if symbol is not a string', async () => {
        const dto = getCreateOrUpdateStockDTO({ symbol: 123 });

        const result = await validate(dto);

        expect(result.length).toBe(1);
        expect(result[0].property).toBe('symbol');
        expect(result[0].constraints['isString']).not.toBeUndefined();
    });
    it('Should validate if PE is empty', async () => {
        const dto = getCreateOrUpdateStockDTO({ PE: null });

        const result = await validate(dto);

        expect(result.length).toBe(1);
        expect(result[0].property).toBe('PE');
        expect(result[0].constraints['isNotEmpty']).not.toBeUndefined();
    });
    it('Should validate if PE is not a number', async () => {
        const dto = getCreateOrUpdateStockDTO({ PE: '123' });

        const result = await validate(dto);

        expect(result.length).toBe(1);
        expect(result[0].property).toBe('PE');
        expect(result[0].constraints['isNumber']).not.toBeUndefined();
    });
    it('Should validate if roe is empty', async () => {
        const dto = getCreateOrUpdateStockDTO({ roe: null });

        const result = await validate(dto);

        expect(result.length).toBe(1);
        expect(result[0].property).toBe('roe');
        expect(result[0].constraints['isNotEmpty']).not.toBeUndefined();
    });
    it('Should validate if roe is not a number', async () => {
        const dto = getCreateOrUpdateStockDTO({ roe: '123' });

        const result = await validate(dto);

        expect(result.length).toBe(1);
        expect(result[0].property).toBe('roe');
        expect(result[0].constraints['isNumber']).not.toBeUndefined();
    });
});

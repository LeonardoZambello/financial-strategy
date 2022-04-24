import 'reflect-metadata';
import { CreateOrUpdateSymbolDTO } from "./create-or-update-symbol.dto";
import { validate } from 'class-validator';

const getCreateOrUpdateSymbolDTO = (changes = null) => {
    const createOrUpdateSymbolDTO = new CreateOrUpdateSymbolDTO();
    
    createOrUpdateSymbolDTO.name = 'ABC';
    createOrUpdateSymbolDTO.PE = 100;
    createOrUpdateSymbolDTO.roe = 1;

    return Object.assign(createOrUpdateSymbolDTO, changes);
}

describe('CreateOrUpdateSymbolDTO', () => {
    it('Should validate if name is empty', async () => {
        const dto = getCreateOrUpdateSymbolDTO({ name: null });

        const result = await validate(dto);

        expect(result.length).toBe(1);
        expect(result[0].property).toBe('name');
        expect(result[0].constraints['isNotEmpty']).not.toBeUndefined();
    });
    it('Should validate if name is not a string', async () => {
        const dto = getCreateOrUpdateSymbolDTO({ name: 123 });

        const result = await validate(dto);

        expect(result.length).toBe(1);
        expect(result[0].property).toBe('name');
        expect(result[0].constraints['isString']).not.toBeUndefined();
    });
    it('Should validate if PE is empty', async () => {
        const dto = getCreateOrUpdateSymbolDTO({ PE: null });

        const result = await validate(dto);

        expect(result.length).toBe(1);
        expect(result[0].property).toBe('PE');
        expect(result[0].constraints['isNotEmpty']).not.toBeUndefined();
    });
    it('Should validate if PE is not a number', async () => {
        const dto = getCreateOrUpdateSymbolDTO({ PE: '123' });

        const result = await validate(dto);

        expect(result.length).toBe(1);
        expect(result[0].property).toBe('PE');
        expect(result[0].constraints['isNumber']).not.toBeUndefined();
    });
    it('Should validate if roe is empty', async () => {
        const dto = getCreateOrUpdateSymbolDTO({ roe: null });

        const result = await validate(dto);

        expect(result.length).toBe(1);
        expect(result[0].property).toBe('roe');
        expect(result[0].constraints['isNotEmpty']).not.toBeUndefined();
    });
    it('Should validate if roe is not a number', async () => {
        const dto = getCreateOrUpdateSymbolDTO({ roe: '123' });

        const result = await validate(dto);

        expect(result.length).toBe(1);
        expect(result[0].property).toBe('roe');
        expect(result[0].constraints['isNumber']).not.toBeUndefined();
    });
});

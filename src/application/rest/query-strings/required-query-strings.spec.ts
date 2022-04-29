import { RequiredQueryStrings } from "./required-query-strings";
import { validate } from 'class-validator';
import 'reflect-metadata';
import { SortOptionsEnum } from "../../../domain/entities/sort-options.enum";
import { OrderEnum } from "../../../domain/entities/order.enum";

describe('RequiredQueryStrings', () => {
    let requiredQueryStrings: RequiredQueryStrings;
    it('Should validate default params', async () => {
        requiredQueryStrings = new RequiredQueryStrings();

        const result = await validate(requiredQueryStrings);

        expect(result.length).toBe(0);
        expect(requiredQueryStrings.page).toBe(1);
        expect(requiredQueryStrings.size).toBe(25);
        expect(requiredQueryStrings.sort).toBe(SortOptionsEnum.RANKING);
        expect(requiredQueryStrings.order).toBe(OrderEnum.ASC);
    });
    it('Should validate if size is number', async () => {
        requiredQueryStrings = new RequiredQueryStrings();
        requiredQueryStrings.size = Number('INVALID_NUMBER');

        const result = await validate(requiredQueryStrings);

        expect(result.length).toBe(1);
        expect(result[0].property).toBe('size');
        expect(result[0].constraints['isInt']).not.toBeUndefined();
    });
    it('Should validate if page is number', async () => {
        requiredQueryStrings = new RequiredQueryStrings();
        requiredQueryStrings.page = Number('INVALID_NUMBER');

        const result = await validate(requiredQueryStrings);

        expect(result.length).toBe(1);
        expect(result[0].property).toBe('page');
        expect(result[0].constraints['isInt']).not.toBeUndefined();
    });
    it('Should validade if size is int', async () => {
      requiredQueryStrings = new RequiredQueryStrings();
      requiredQueryStrings.size = 1.1;

      const result = await validate(requiredQueryStrings);

      expect(result.length).toBe(1);
      expect(result[0].property).toBe('size');
      expect(result[0].constraints['isInt']).not.toBeUndefined();
    });
    it('Should validade if page is int', async () => {
      requiredQueryStrings = new RequiredQueryStrings();
      requiredQueryStrings.page = 2.7;

      const result = await validate(requiredQueryStrings);

      expect(result.length).toBe(1);
      expect(result[0].property).toBe('page');
      expect(result[0].constraints['isInt']).not.toBeUndefined();
    });
    it('Should validate if size is bigger than 0', async () => {
        requiredQueryStrings = new RequiredQueryStrings();
        requiredQueryStrings.size = 0;

        let result = await validate(requiredQueryStrings);

        expect(result.length).toBe(1)
        expect(result[0].property).toBe('size');
        expect(result[0].constraints['min']).not.toBeUndefined();

        requiredQueryStrings.size = 1;
        result = await validate(requiredQueryStrings);
        expect(result.length).toBe(0)
    });
    it('Should validate if size is equal or less than 100', async () => {
        requiredQueryStrings = new RequiredQueryStrings();
        requiredQueryStrings.size = 101;

        let result = await validate(requiredQueryStrings);

        expect(result.length).toBe(1)
        expect(result[0].property).toBe('size');
        expect(result[0].constraints['max']).not.toBeUndefined();

        requiredQueryStrings.size = 100;
        result = await validate(requiredQueryStrings);
        expect(result.length).toBe(0)
    });
});

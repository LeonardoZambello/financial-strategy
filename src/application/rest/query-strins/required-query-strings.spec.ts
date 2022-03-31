import { RequiredQueryStrings } from "./required-query-strings";
import { validate } from 'class-validator';
import 'reflect-metadata';

describe('RequiredQueryStrings', () => {
    let requiredQueryStrings: RequiredQueryStrings;
    it('Should validate if the query string limit is provided and if dont should setted the default value', async () => {
        requiredQueryStrings = new RequiredQueryStrings();
    
        const result = await validate(requiredQueryStrings);
    
        expect(result.length).toBe(0);
      });
      it('Should validate when the query string limit is provided if it value is greater than 100', async () => {
        requiredQueryStrings = new RequiredQueryStrings();

        requiredQueryStrings.limit = 101;
    
        const result = await validate(requiredQueryStrings);
    
        expect(result.length).toBe(1);
        expect(result[0].property).toBe('limit')
        expect(result[0].constraints['max']).not.toBeUndefined();
      });
      it('Should validate when the query string limit is provided if it value is less than 0', async () => {
        requiredQueryStrings = new RequiredQueryStrings();

        requiredQueryStrings.limit = -1;
    
        const result = await validate(requiredQueryStrings);
        
        expect(result.length).toBe(1);
        expect(result[0].property).toBe('limit')
        expect(result[0].constraints['min']).not.toBeUndefined();
      });
      it('Should validate if the query string skip is provided and if dont should setted the default value', async () => {
        requiredQueryStrings = new RequiredQueryStrings();
    
        const result = await validate(requiredQueryStrings);
    
        expect(result.length).toBe(0);
        expect(requiredQueryStrings.skip).toBe(0);
      });
      it('Should validate when the query string skip is provided if it value is less than 0', async () => {
        requiredQueryStrings = new RequiredQueryStrings();

        requiredQueryStrings.skip = -1;
    
        const result = await validate(requiredQueryStrings);
    
        expect(result.length).toBe(1);
        expect(result[0].property).toBe('skip')
        expect(result[0].constraints['min']).not.toBeUndefined();
      });
      it('If the query string roe is provided should validate it is a number', async () => {
        requiredQueryStrings = new RequiredQueryStrings();

        requiredQueryStrings.roe = Number('INVALID_NUMBER');

        const result = await validate(requiredQueryStrings);

        expect(result.length).toBe(1);
        expect(result[0].property).toBe('roe');
        expect(result[0].constraints['isNumber']).not.toBeUndefined();
      });
      it('If the query string forwardPE is provided should validate it is a number', async () => {
        requiredQueryStrings = new RequiredQueryStrings();

        requiredQueryStrings.forwardPE = Number('INVALID_NUMBER');

        const result = await validate(requiredQueryStrings);

        expect(result.length).toBe(1);
        expect(result[0].property).toBe('forwardPE');
        expect(result[0].constraints['isNumber']).not.toBeUndefined();
      });
});

import { mock } from "jest-mock-extended";
import { SaveSymbolsUseCase } from "../../domain/use-cases/save-symbols";
import { SymbolNameListDTO } from "../dto/symbol-name-list.dto";
import { SymbolMapper } from "../mappers/symbol.mapper";
import { SymbolService } from "./symbol.service";

const getSymbolNameListDTO = () => {
    const symbolNameListDTO = new SymbolNameListDTO();
    
    symbolNameListDTO.names = ['AAAA5', 'AAAA6'];

    return symbolNameListDTO;
}

const setupDependencies = () => {
	const saveSymbolUseCase = mock<SaveSymbolsUseCase>();
    const symbolMapper = mock<SymbolMapper>();
	return {
		saveSymbolUseCase,
        symbolMapper
	};
}; 

describe('SymbolService', () => {
    it('Should return null if a invalid dto is provided', async () => {
        const { saveSymbolUseCase, symbolMapper } = setupDependencies();

        const symbolService = new SymbolService(saveSymbolUseCase, symbolMapper);

        const result = await symbolService.save(null);

        expect(result).toBeNull();
    });
    it('Should save a list of symbols if valid data is provided', async () => {
        const dto = getSymbolNameListDTO();

        const { saveSymbolUseCase, symbolMapper } = setupDependencies();

        const symbolService = new SymbolService(saveSymbolUseCase, symbolMapper);

        await symbolService.save(dto);

        expect(symbolMapper.createDTOtoDomain).toBeCalledTimes(1);
        expect(saveSymbolUseCase.handle).toBeCalledTimes(1);
    });
});

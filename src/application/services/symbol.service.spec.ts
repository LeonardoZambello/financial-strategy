import { mock } from "jest-mock-extended";
import { Symbol } from "../../domain/entities/symbol.entity";
import { FindSymbolByNameUseCase } from "../../domain/use-cases/find-symbol-by-name";
import { SaveSymbolsUseCase } from "../../domain/use-cases/save-symbols";
import { SymbolNameListDTO } from "../dto/symbol-name-list.dto";
import { SymbolMapper } from "../mappers/symbol.mapper";
import { SymbolService } from "./symbol.service";
import { v4 as uuidv4 } from 'uuid';
import { FindSymbolByNameDTO } from "../dto/find-symbol-by-name.dto";

const getSymbolNameListDTO = () => {
    const symbolNameListDTO = new SymbolNameListDTO();
    
    symbolNameListDTO.names = ['AAAA5', 'AAAA6'];

    return symbolNameListDTO;
}

const setupDependencies = () => {
	const saveSymbolUseCase = mock<SaveSymbolsUseCase>();
    const findSymbolByNameUseCase = mock<FindSymbolByNameUseCase>();
    const symbolMapper = mock<SymbolMapper>();
	return {
		saveSymbolUseCase,
        findSymbolByNameUseCase,
        symbolMapper
	};
}; 

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

const getFindSymbolByNameDTO = (symbol: Symbol): FindSymbolByNameDTO => {
    const findSymbolByNameDTO = new FindSymbolByNameDTO();
    findSymbolByNameDTO.id = symbol.id;
    findSymbolByNameDTO.name = symbol.name;
    findSymbolByNameDTO.forwardPE = symbol.forwardPE;
    findSymbolByNameDTO.roe = symbol.roe;
    findSymbolByNameDTO.ranking = symbol.ranking;
    findSymbolByNameDTO.reason = symbol.reason;
    return findSymbolByNameDTO;
};

describe('SymbolService', () => {
    it('Should return null if a invalid dto is provided', async () => {
        const symbolNameList = null;

        const { saveSymbolUseCase, findSymbolByNameUseCase, symbolMapper } = setupDependencies();

        const symbolService = new SymbolService(saveSymbolUseCase, findSymbolByNameUseCase, symbolMapper);

        const result = await symbolService.save(symbolNameList);

        expect(result).toBeNull();
        expect(symbolMapper.createDTOtoDomain).not.toBeCalled();
        expect(saveSymbolUseCase.handle).not.toBeCalled();
    });
    it('Should save a list of symbols if valid data is provided', async () => {
        const dto = getSymbolNameListDTO();

        const { saveSymbolUseCase, findSymbolByNameUseCase, symbolMapper } = setupDependencies();

        const symbolService = new SymbolService(saveSymbolUseCase, findSymbolByNameUseCase, symbolMapper);

        await symbolService.save(dto);

        expect(symbolMapper.createDTOtoDomain).toBeCalledTimes(1);
        expect(symbolMapper.createDTOtoDomain).toBeCalledWith(dto);
        expect(saveSymbolUseCase.handle).toBeCalledTimes(1);
    });
    it('Should return null if try to find a symbol by name and receive a null name', async () => {
        const name = null;

        const { saveSymbolUseCase, findSymbolByNameUseCase, symbolMapper } = setupDependencies();

        const symbolService = new SymbolService(saveSymbolUseCase, findSymbolByNameUseCase, symbolMapper);

        const result = await symbolService.findSymbolByName(name);

        expect(result).toBeNull();
        expect(findSymbolByNameUseCase.handle).not.toBeCalled();
        expect(symbolMapper.createDomainToDTO).not.toBeCalled();
    });
    it('Should return a symbol filtering by provided name', async () => {
        const name = 'ANYNAME';

        const symbol = getSymbol();

        const { saveSymbolUseCase, findSymbolByNameUseCase, symbolMapper } = setupDependencies();

        findSymbolByNameUseCase.handle.mockReturnValueOnce(Promise.resolve(symbol));

        symbolMapper.createDomainToDTO.mockReturnValueOnce(getFindSymbolByNameDTO(symbol));

        const symbolService = new SymbolService(saveSymbolUseCase, findSymbolByNameUseCase, symbolMapper);

        const result = await symbolService.findSymbolByName(name);

        expect(result.id).toBe(symbol.id);
        expect(result.name).toBe(symbol.name);
        expect(result.forwardPE).toBe(symbol.forwardPE);
        expect(result.roe).toBe(symbol.roe);
        expect(result.ranking).toBe(symbol.ranking);
        expect(result.reason).toBe(symbol.reason);
        expect(findSymbolByNameUseCase.handle).toBeCalledWith(name);
        expect(symbolMapper.createDomainToDTO).toBeCalledWith(symbol);
    });
});

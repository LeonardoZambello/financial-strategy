import { mock } from "jest-mock-extended";
import { Symbol } from "../../domain/entities/symbol.entity";
import { FindSymbolByNameUseCase } from "../../domain/use-cases/find-symbol-by-name";
import { SaveSymbolsUseCase } from "../../domain/use-cases/save-symbols";
import { SymbolNameListDTO } from "../dto/symbol-name-list.dto";
import { SymbolMapper } from "../mappers/symbol.mapper";
import { SymbolService } from "./symbol.service";
import { v4 as uuidv4 } from 'uuid';
import { FindSymbolByNameDTO } from "../dto/find-symbol-by-name.dto";
import { Request } from 'express';
import { FindAllSymbolsUseCase } from "../../domain/use-cases/find-all-symbols.use-case";
import { DeleteSymbolUseCase } from "../../domain/use-cases/delete-symbol.use-case";
import { CollectAndUpdateSymbolsValuesUseCase } from "../../domain/use-cases/collect-and-update-symbols-values.use-case";
import { CreateOrUpdateSymbolDTO } from "../dto/create-or-update-symbol.dto";

const getSymbolNameListDTO = () => {
    const symbolNameListDTO = new SymbolNameListDTO();
    
    symbolNameListDTO.names = ['AAAA5', 'AAAA6'];

    return symbolNameListDTO;
}

const getCreateOrUpdateSymbolDTO = (changes = null): CreateOrUpdateSymbolDTO => {
    const createOrUpdateSymbolDTO = new CreateOrUpdateSymbolDTO();
    
    createOrUpdateSymbolDTO.name = 'ABC';
    createOrUpdateSymbolDTO.PE = 100;
    createOrUpdateSymbolDTO.roe = 1;

    return Object.assign(createOrUpdateSymbolDTO, changes);
} 

const setupDependencies = () => {
	const saveSymbolUseCase = mock<SaveSymbolsUseCase>();
    const findSymbolByNameUseCase = mock<FindSymbolByNameUseCase>();
    const symbolMapper = mock<SymbolMapper>();
    const findAllSymbolsUseCase = mock<FindAllSymbolsUseCase>();
    const deleteSymbolUseCase = mock<DeleteSymbolUseCase>();
    const collectAndUpdateSymbolsValuesUseCase = mock<CollectAndUpdateSymbolsValuesUseCase>();
    const request = mock<Request>();
	return {
		saveSymbolUseCase,
        findSymbolByNameUseCase,
        findAllSymbolsUseCase,
        deleteSymbolUseCase,
        collectAndUpdateSymbolsValuesUseCase,
        symbolMapper,
        request
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

        const { saveSymbolUseCase, findSymbolByNameUseCase, findAllSymbolsUseCase, deleteSymbolUseCase, collectAndUpdateSymbolsValuesUseCase, symbolMapper, request } = setupDependencies();

        const symbolService = new SymbolService(saveSymbolUseCase, findSymbolByNameUseCase, findAllSymbolsUseCase, deleteSymbolUseCase, collectAndUpdateSymbolsValuesUseCase, symbolMapper, request);

        const result = await symbolService.save(symbolNameList);

        expect(result).toBeNull();
        expect(symbolMapper.createDTOtoDomain).not.toBeCalled();
        expect(saveSymbolUseCase.handle).not.toBeCalled();
    });
    it('Should save a list of symbols if valid data is provided', async () => {
        const dto = getCreateOrUpdateSymbolDTO();

        const { saveSymbolUseCase, findSymbolByNameUseCase, findAllSymbolsUseCase, deleteSymbolUseCase, collectAndUpdateSymbolsValuesUseCase, symbolMapper, request } = setupDependencies();

        const symbolService = new SymbolService(saveSymbolUseCase, findSymbolByNameUseCase, findAllSymbolsUseCase, deleteSymbolUseCase, collectAndUpdateSymbolsValuesUseCase, symbolMapper, request);

        await symbolService.save(dto);

        expect(symbolMapper.createDTOtoDomain).toBeCalledTimes(1);
        expect(symbolMapper.createDTOtoDomain).toBeCalledWith(dto);
        expect(saveSymbolUseCase.handle).toBeCalledTimes(1);
    });
    it('Should return null if try to find a symbol by name and receive a null name', async () => {
        const name = null;

        const { saveSymbolUseCase, findSymbolByNameUseCase, findAllSymbolsUseCase, deleteSymbolUseCase, collectAndUpdateSymbolsValuesUseCase, symbolMapper, request } = setupDependencies();

        const symbolService = new SymbolService(saveSymbolUseCase, findSymbolByNameUseCase, findAllSymbolsUseCase, deleteSymbolUseCase, collectAndUpdateSymbolsValuesUseCase, symbolMapper, request);

        const result = await symbolService.findSymbolByName(name);

        expect(result).toBeNull();
        expect(findSymbolByNameUseCase.handle).not.toBeCalled();
        expect(symbolMapper.createDomainToDTO).not.toBeCalled();
    });
    it('Should return a symbol filtering by provided name', async () => {
        const name = 'ANYNAME';

        const symbol = getSymbol();

        const { saveSymbolUseCase, findSymbolByNameUseCase, findAllSymbolsUseCase, deleteSymbolUseCase, collectAndUpdateSymbolsValuesUseCase, symbolMapper, request } = setupDependencies();

        findSymbolByNameUseCase.handle.mockReturnValueOnce(Promise.resolve(symbol));

        symbolMapper.createDomainToDTO.mockReturnValueOnce(getFindSymbolByNameDTO(symbol));

        const symbolService = new SymbolService(saveSymbolUseCase, findSymbolByNameUseCase, findAllSymbolsUseCase, deleteSymbolUseCase, collectAndUpdateSymbolsValuesUseCase, symbolMapper, request);

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
    it('Shold find symbols with pagination parameters with success', async () => {
        const { saveSymbolUseCase, findSymbolByNameUseCase, findAllSymbolsUseCase, deleteSymbolUseCase, collectAndUpdateSymbolsValuesUseCase, symbolMapper, request } = setupDependencies();

        const symbols = new Array<Symbol>();
        const symbol = getSymbol();
        symbols.push(symbol);

        findAllSymbolsUseCase.handle.mockReturnValueOnce(Promise.resolve(symbols));

        symbolMapper.createDomainToDTO.mockReturnValueOnce(getFindSymbolByNameDTO(symbol));

        const symbolService = new SymbolService(saveSymbolUseCase, findSymbolByNameUseCase, findAllSymbolsUseCase, deleteSymbolUseCase, collectAndUpdateSymbolsValuesUseCase, symbolMapper, request);

        const result = await symbolService.findAllSymbols();

        expect(result.length).toBe(1);
        expect(findAllSymbolsUseCase.handle).toBeCalledTimes(1);
        expect(symbolMapper.createDomainToDTO).toBeCalledTimes(symbols.length);
    });
    it('Should return null if not found symbols with pagination parameters', async () => {
        const { saveSymbolUseCase, findSymbolByNameUseCase, findAllSymbolsUseCase, deleteSymbolUseCase, collectAndUpdateSymbolsValuesUseCase, symbolMapper, request } = setupDependencies();

        const symbols = new Array<Symbol>();
        const symbol = getSymbol();
        symbols.push(symbol);

        findAllSymbolsUseCase.handle.mockReturnValueOnce(Promise.resolve(null));

        const symbolService = new SymbolService(saveSymbolUseCase, findSymbolByNameUseCase, findAllSymbolsUseCase, deleteSymbolUseCase, collectAndUpdateSymbolsValuesUseCase, symbolMapper, request);

        const result = await symbolService.findAllSymbols();

        expect(result).toBeNull();
        expect(findAllSymbolsUseCase.handle).toBeCalledTimes(1);
        expect(symbolMapper.createDomainToDTO).not.toBeCalled();
    });
    it('Should return null if not receive a name to delete symbol', async () => {
        const { saveSymbolUseCase, findSymbolByNameUseCase, findAllSymbolsUseCase, deleteSymbolUseCase, collectAndUpdateSymbolsValuesUseCase, symbolMapper, request } = setupDependencies();

        const symbolService = new SymbolService(saveSymbolUseCase, findSymbolByNameUseCase, findAllSymbolsUseCase, deleteSymbolUseCase, collectAndUpdateSymbolsValuesUseCase, symbolMapper, request);

        const result = await symbolService.delete(null);

        expect(result).toBeNull();
    });
    it('Should delete a symbol with success', async () => {
        const { saveSymbolUseCase, findSymbolByNameUseCase, findAllSymbolsUseCase, deleteSymbolUseCase, collectAndUpdateSymbolsValuesUseCase, symbolMapper, request } = setupDependencies();

        const symbolService = new SymbolService(saveSymbolUseCase, findSymbolByNameUseCase, findAllSymbolsUseCase, deleteSymbolUseCase, collectAndUpdateSymbolsValuesUseCase, symbolMapper, request);

        const symbolName = 'ABCD';

        await symbolService.delete(symbolName);

        expect(deleteSymbolUseCase.handle).toBeCalledWith(symbolName);
    });
    it('Should create or update a symbol with success', async () => {
        const { saveSymbolUseCase, findSymbolByNameUseCase, findAllSymbolsUseCase, deleteSymbolUseCase, collectAndUpdateSymbolsValuesUseCase, symbolMapper, request } = setupDependencies();

        const symbolService = new SymbolService(saveSymbolUseCase, findSymbolByNameUseCase, findAllSymbolsUseCase, deleteSymbolUseCase, collectAndUpdateSymbolsValuesUseCase, symbolMapper, request);

        await symbolService.createOrUpdateSymbols();

        expect(collectAndUpdateSymbolsValuesUseCase.handle).toBeCalledTimes(1);
    });
});

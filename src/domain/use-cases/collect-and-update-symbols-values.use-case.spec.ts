import { mock } from "jest-mock-extended";
import { ISymbolDataCollector } from "../collector/symbol-data.collector";
import { Symbol } from "../entities/symbol.entity";
import { ISymbolRepository } from "../repositories/symbol.repository";
import { CollectAndUpdateSymbolsValuesUseCase } from "./collect-and-update-symbols-values.use-case";
import { v4 as uuidv4 } from 'uuid';

const setupDependencies = () => {
    const symbolDataCollector = mock<ISymbolDataCollector>();
    const symbolRepository = mock<ISymbolRepository>();
    return {
        symbolDataCollector,
        symbolRepository,
    };
};

describe('CollectAndUpdateSymbolsValuesUseCase', () => {
    let collectAndUpdateSymbolsValuesUseCase: CollectAndUpdateSymbolsValuesUseCase;
    it('Should collect data and create/update symbols with new values', async () => {
        const { symbolDataCollector, symbolRepository } = setupDependencies();

        const symbols = new Array<Symbol>();

        const symbolOne = new Symbol();
        symbolOne.name = 'ABC';
        symbolOne.roe = 100;
        symbolOne.forwardPE = 100;

        const symbolTwo = new Symbol();
        symbolTwo.name = 'DEF';
        symbolTwo.roe = 50;
        symbolTwo.forwardPE = 50;

        symbols.push(symbolOne, symbolTwo);

        symbolDataCollector.collectData.mockReturnValueOnce(Promise.resolve(symbols));

        collectAndUpdateSymbolsValuesUseCase = new CollectAndUpdateSymbolsValuesUseCase(symbolDataCollector, symbolRepository);

        await collectAndUpdateSymbolsValuesUseCase.handle();

        expect(symbolRepository.findByName).toBeCalledTimes(symbols.length);
        expect(symbolRepository.save).toBeCalledTimes(symbols.length);
    });
    it('Should update a symbol with new values collected', async () => {
        const { symbolDataCollector, symbolRepository } = setupDependencies();

        const symbols = new Array<Symbol>();

        const symbolOne = new Symbol();
        symbolOne.name = 'ABC';
        symbolOne.roe = 100;
        symbolOne.forwardPE = 100;

        symbols.push(symbolOne);

        symbolDataCollector.collectData.mockReturnValueOnce(Promise.resolve(symbols));

        const symbolFromDB = new Symbol();
        symbolFromDB.id = uuidv4();
        symbolFromDB.name = 'ABC';
        symbolFromDB.roe = 100;
        symbolFromDB.roePosition = 1;
        symbolFromDB.forwardPE = 10;
        symbolFromDB.forwardPEPosition = 1;
        symbolFromDB.ranking = 2;
        symbolFromDB.createdAt = new Date();
        symbolFromDB.updatedAt = new Date();
        symbolFromDB.reason = null;

        const symbolToUpdate = Object.assign(symbolFromDB, symbolOne);

        symbolRepository.findByName.mockReturnValueOnce(Promise.resolve(symbolFromDB));

        collectAndUpdateSymbolsValuesUseCase = new CollectAndUpdateSymbolsValuesUseCase(symbolDataCollector, symbolRepository);

        await collectAndUpdateSymbolsValuesUseCase.handle();

        expect(symbolRepository.findByName).toBeCalledWith(symbolOne.name)
        expect(symbolRepository.save).toBeCalledWith(symbolToUpdate);
    });
});

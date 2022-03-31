import { mock } from "jest-mock-extended";
import { Symbol } from "../../domain/entities/symbol.entity";
import { YahooFinanceAPICliente } from "../api-client/yahoo-finance.api-client";
import { SymbolRepository } from "../persistence/postgres/repositories/symbol.repository";
import { CollectSymbolROEJob } from "./collect-symbol-roe.job";

const setupDependencies = () => {
    const symbolRepository = mock<SymbolRepository>();
	const yahooFinanceAPICliente = mock<YahooFinanceAPICliente>();
	return {
        symbolRepository,
		yahooFinanceAPICliente
	};
}; 

describe('CollectSymbolROEJob', () => {
    it('Should collect symbol roe with success', async () => {
        process.env.ENABLE_JOB_ROE = 'true'
        const {  symbolRepository, yahooFinanceAPICliente } = setupDependencies();

        const collectSymbolROEJob = new CollectSymbolROEJob(symbolRepository, yahooFinanceAPICliente);

        const symbols = new Array<Symbol>();

        const symbolOne = new Symbol();
        symbolOne.name = 'AAAA5';

        const symbolTwo = new Symbol();
        symbolTwo.name = 'AAAA6';

        symbols.push(symbolOne, symbolTwo);

        symbolRepository.findSymbolsWithOutROE.mockReturnValueOnce(Promise.resolve(symbols));

        yahooFinanceAPICliente.collectROE.mockReturnValue(Promise.resolve(10));

        await collectSymbolROEJob.handle();

        expect(symbolRepository.findSymbolsWithOutROE).toBeCalledTimes(1);
        expect(yahooFinanceAPICliente.collectROE).toBeCalledTimes(symbols.length);
        expect(symbolRepository.save).toBeCalledTimes(symbols.length);
        expect(symbolOne.roe).toBe(10);
        expect(symbolTwo.roe).toBe(10);
    });
    it('Should not collect symbol roe if none symbol was found', async () => {
        process.env.ENABLE_JOB_ROE = 'true'
        const {  symbolRepository ,yahooFinanceAPICliente } = setupDependencies();

        const collectSymbolROEJob = new CollectSymbolROEJob(symbolRepository, yahooFinanceAPICliente);

        symbolRepository.findSymbolsWithOutROE.mockReturnValueOnce(Promise.resolve([]));

        await collectSymbolROEJob.handle();

        expect(symbolRepository.findSymbolsWithOutROE).toBeCalledTimes(1);
        expect(yahooFinanceAPICliente.collectROE).not.toBeCalled();
        expect(symbolRepository.save).not.toBeCalled();
    });
    it('Should not collect symbol roe if symbol name is invalid', async () => {
        process.env.ENABLE_JOB_ROE = 'true'
        const {  symbolRepository, yahooFinanceAPICliente } = setupDependencies();

        const collectSymbolROEJob = new CollectSymbolROEJob(symbolRepository, yahooFinanceAPICliente);

        const symbols = new Array<Symbol>();

        const symbol = new Symbol();
        symbol.name = 'AAAA5';

        symbols.push(symbol);

        symbolRepository.findSymbolsWithOutROE.mockReturnValueOnce(Promise.resolve(symbols));

        yahooFinanceAPICliente.collectROE.mockReturnValueOnce(Promise.resolve(null));

        await collectSymbolROEJob.handle();

        expect(symbolRepository.findSymbolsWithOutROE).toBeCalledTimes(1);
        expect(yahooFinanceAPICliente.collectROE).toBeCalledTimes(symbols.length);
        expect(symbolRepository.save).toBeCalledTimes(symbols.length);
        expect(symbol.reason).toBe('Symbol not found in Yahoo API');
    });
    it('Should not save symbol roe if Yahoo API finance throws', async () => {
        process.env.ENABLE_JOB_ROE = 'true'
        const {  symbolRepository, yahooFinanceAPICliente } = setupDependencies();

        const collectSymbolROEJob = new CollectSymbolROEJob(symbolRepository, yahooFinanceAPICliente);

        const symbols = new Array<Symbol>();

        const symbol = new Symbol();
        symbol.name = 'AAAA5';

        symbols.push(symbol);

        symbolRepository.findSymbolsWithOutROE.mockReturnValueOnce(Promise.resolve(symbols));

        yahooFinanceAPICliente.collectROE.mockReturnValueOnce(Promise.reject('Error status code: 429'));

        await expect(collectSymbolROEJob.handle()).rejects.toBe('Error status code: 429');
        expect(symbol.reason).toBeUndefined();
        expect(symbol.roe).toBeUndefined();
        expect(symbolRepository.save).not.toBeCalled();
    });
    it('Should only execute job if env ENABLE_JOB_ROE is "true"', async () => {
        process.env.ENABLE_JOB_ROE = 'false'

        const {  symbolRepository ,yahooFinanceAPICliente } = setupDependencies();

        const collectSymbolROEJob = new CollectSymbolROEJob(symbolRepository, yahooFinanceAPICliente);

        await collectSymbolROEJob.handle();

        expect(symbolRepository.findSymbolsWithOutROE).not.toBeCalled();
        expect(yahooFinanceAPICliente.collectROE).not.toBeCalled();
        expect(symbolRepository.save).not.toBeCalled();
    });
});

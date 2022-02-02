import { mock } from "jest-mock-extended";
import { Symbol } from "../../domain/entities/symbol.entity";
import { YahooFinanceAPICliente } from "../api-client/yahoo-finance.api-client";
import { SymbolRepository } from "../persistence/postgres/repositories/symbol.repository";
import { CollectSymbolForwardPEJob } from "./collect-symbol-forwardpe.job";

const setupDependencies = () => {
    const symbolRepository = mock<SymbolRepository>();
	const yahooFinanceAPICliente = mock<YahooFinanceAPICliente>();
	return {
        symbolRepository,
		yahooFinanceAPICliente
	};
}; 

describe('CollectSymbolForwardPEJob', () => {
    it('Should collect symbol forwardPE with success', async () => {
        const {  symbolRepository ,yahooFinanceAPICliente } = setupDependencies();

        const collectSymbolForwardPEJob = new CollectSymbolForwardPEJob(symbolRepository, yahooFinanceAPICliente);

        const symbols = new Array<Symbol>();

        const symbolOne = new Symbol();
        symbolOne.name = 'AAAA5';

        const symbolTwo = new Symbol();
        symbolTwo.name = 'AAAA6';

        symbols.push(symbolOne, symbolTwo);

        symbolRepository.findSymbolsWithOutForwardPE.mockReturnValueOnce(Promise.resolve(symbols));

        yahooFinanceAPICliente.collectForwardPE.mockReturnValue(Promise.resolve(10));

        await collectSymbolForwardPEJob.handle();

        expect(symbolRepository.findSymbolsWithOutForwardPE).toBeCalledTimes(1);
        expect(yahooFinanceAPICliente.collectForwardPE).toBeCalledTimes(symbols.length);
        expect(symbolRepository.save).toBeCalledTimes(symbols.length);
        expect(symbolOne.forwardPE).toBe(10);
        expect(symbolTwo.forwardPE).toBe(10);
    });
    it('Should not collect symbol forwardPE if none symbol was found', async () => {
        const {  symbolRepository ,yahooFinanceAPICliente } = setupDependencies();

        const collectSymbolForwardPEJob = new CollectSymbolForwardPEJob(symbolRepository, yahooFinanceAPICliente);

        symbolRepository.findSymbolsWithOutForwardPE.mockReturnValueOnce(Promise.resolve([]));

        await collectSymbolForwardPEJob.handle();

        expect(symbolRepository.findSymbolsWithOutForwardPE).toBeCalledTimes(1);
        expect(yahooFinanceAPICliente.collectForwardPE).not.toBeCalled();
        expect(symbolRepository.save).not.toBeCalled();
    });
    it('Should not collect symbol forwardPE if symbol name is invalid', async () => {
        const {  symbolRepository ,yahooFinanceAPICliente } = setupDependencies();

        const collectSymbolForwardPEJob = new CollectSymbolForwardPEJob(symbolRepository, yahooFinanceAPICliente);

        const symbols = new Array<Symbol>();

        const symbol = new Symbol();
        symbol.name = 'AAAA5';

        symbols.push(symbol);

        symbolRepository.findSymbolsWithOutForwardPE.mockReturnValueOnce(Promise.resolve(symbols));

        yahooFinanceAPICliente.collectForwardPE.mockReturnValueOnce(Promise.resolve(null));

        await collectSymbolForwardPEJob.handle();

        expect(symbolRepository.findSymbolsWithOutForwardPE).toBeCalledTimes(1);
        expect(yahooFinanceAPICliente.collectForwardPE).toBeCalledTimes(symbols.length);
        expect(symbolRepository.save).toBeCalledTimes(symbols.length);
        expect(symbol.reason).toBe('Symbol not found in Yahoo API');
    });
    it.only('Should not save symbol forwardPE if Yahoo API finance throws', async () => {
        const {  symbolRepository ,yahooFinanceAPICliente } = setupDependencies();

        const collectSymbolForwardPEJob = new CollectSymbolForwardPEJob(symbolRepository, yahooFinanceAPICliente);

        const symbols = new Array<Symbol>();

        const symbol = new Symbol();
        symbol.name = 'AAAA5';

        symbols.push(symbol);

        symbolRepository.findSymbolsWithOutForwardPE.mockReturnValueOnce(Promise.resolve(symbols));

        yahooFinanceAPICliente.collectForwardPE.mockReturnValueOnce(Promise.reject('Error status code: 429'));

        await expect(collectSymbolForwardPEJob.handle()).rejects.toBe('Error status code: 429');
        expect(symbol.reason).toBeUndefined();
        expect(symbol.forwardPE).toBeUndefined();
        expect(symbolRepository.save).not.toBeCalled();
    });
});

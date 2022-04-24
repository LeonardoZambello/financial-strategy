import { mock } from "jest-mock-extended";
import { Symbol } from "../../domain/entities/symbol.entity";
import { SymbolRepository } from "../persistence/postgres/repositories/symbol.repository";
import { RankSymbolsJob } from "./rank-symbols.job";

const createSymbol = (name: string, roe: number, forwardPE: number): Symbol => {
    const symbol = new Symbol();
    symbol.id = '123';
    symbol.name = name;
    symbol.roe = roe;
    symbol.createdAt = new Date();
    symbol.updatedAt = new Date();
    symbol.forwardPE = forwardPE;
    symbol.reason = null;
    return symbol;
}

const setupDependencies = () => {
    const symbolRepository = mock<SymbolRepository>();
	return {
        symbolRepository,
	};
}; 

describe('RankSymbolsJob', () => {
    it('Should rank symbols by roe if exists', async () => {
        const { symbolRepository } = setupDependencies();

        const symbolsWithROE = new Array<Symbol>();
        const symbolOne = createSymbol('XXXX6', 98, 1);
        const symbolTwo = createSymbol('XXXX5', 10, 100);
        symbolsWithROE.push(symbolOne, symbolTwo);

        symbolRepository.findSymbolsWithROE.mockReturnValueOnce(Promise.resolve(symbolsWithROE));

        symbolRepository.findSymbolsWithForwardPE.mockReturnValueOnce(Promise.resolve([]));

        symbolRepository.findSymbolsWithNegativeForwardPE.mockReturnValueOnce(Promise.resolve([]));

        symbolRepository.findSymbolsWithROEAndForwardPE.mockReturnValueOnce(Promise.resolve([]));

        const rankSymbolsJob = new RankSymbolsJob(symbolRepository);

        await rankSymbolsJob.handle();

        expect(symbolRepository.saveAll).toBeCalledTimes(1);
        expect(symbolOne.roePosition).toBe(1);
        expect(symbolTwo.roePosition).toBe(2);
    });
    it('Should rank symbols by forwardPE if exists', async () => {
        const { symbolRepository } = setupDependencies();

        const symbolsWithForwardPE = new Array<Symbol>();
        const symbolOne = createSymbol('XXXX6', 98, 1);
        const symbolTwo = createSymbol('XXXX5', 10, 100);
        symbolsWithForwardPE.push(symbolOne, symbolTwo);

        symbolRepository.findSymbolsWithROE.mockReturnValueOnce(Promise.resolve([]));

        symbolRepository.findSymbolsWithForwardPE.mockReturnValueOnce(Promise.resolve(symbolsWithForwardPE));

        symbolRepository.findSymbolsWithNegativeForwardPE.mockReturnValueOnce(Promise.resolve([]));

        symbolRepository.findSymbolsWithROEAndForwardPE.mockReturnValueOnce(Promise.resolve([]));

        const rankSymbolsJob = new RankSymbolsJob(symbolRepository);

        await rankSymbolsJob.handle();

        expect(symbolRepository.saveAll).toBeCalledTimes(1);
        expect(symbolOne.forwardPEPosition).toBe(1);
        expect(symbolTwo.forwardPEPosition).toBe(2);
    });
    it('Should rank symbols by negative forwardPE if exists', async () => {
        const { symbolRepository } = setupDependencies();

        const symbolsWithForwardPE = new Array<Symbol>();
        const symbolOne = createSymbol('XXXX6', 98, -1);
        const symbolTwo = createSymbol('XXXX5', 10, -100);
        symbolsWithForwardPE.push(symbolOne, symbolTwo);

        symbolRepository.findSymbolsWithROE.mockReturnValueOnce(Promise.resolve([]));

        symbolRepository.findSymbolsWithForwardPE.mockReturnValueOnce(Promise.resolve([]));

        symbolRepository.findSymbolsWithNegativeForwardPE.mockReturnValueOnce(Promise.resolve(symbolsWithForwardPE));

        symbolRepository.findSymbolsWithROEAndForwardPE.mockReturnValueOnce(Promise.resolve([]));

        const rankSymbolsJob = new RankSymbolsJob(symbolRepository);

        await rankSymbolsJob.handle();

        expect(symbolRepository.saveAll).toBeCalledTimes(1);
        expect(symbolOne.forwardPEPosition).toBe(1);
        expect(symbolTwo.forwardPEPosition).toBe(2);
    });
    it('Should rank symbols if forwardPE and roe exists', async () => {
        const { symbolRepository } = setupDependencies();

        const symbolsToRank = new Array<Symbol>();

        const symbolOne = createSymbol('XXXX6', 98, 1);
        symbolOne.roePosition = 1;
        symbolOne.forwardPEPosition = 1;

        const symbolTwo = createSymbol('XXXX5', 10, 100);
        symbolTwo.roePosition = 2;
        symbolTwo.forwardPEPosition = 2;

        symbolsToRank.push(symbolOne, symbolTwo);

        symbolRepository.findSymbolsWithROE.mockReturnValueOnce(Promise.resolve([]));

        symbolRepository.findSymbolsWithForwardPE.mockReturnValueOnce(Promise.resolve([]));

        symbolRepository.findSymbolsWithNegativeForwardPE.mockReturnValueOnce(Promise.resolve([]));

        symbolRepository.findSymbolsWithROEAndForwardPE.mockReturnValueOnce(Promise.resolve(symbolsToRank));

        const rankSymbolsJob = new RankSymbolsJob(symbolRepository);

        await rankSymbolsJob.handle();

        expect(symbolRepository.saveAll).toBeCalledTimes(1);
        expect(symbolOne.ranking).toBe(2);
        expect(symbolTwo.ranking).toBe(4);
    });
});

import { Inject } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { SYMBOL_REPOSITORY_NAME } from "../../domain/repositories/symbol.repository";
import { SymbolRepository } from "../persistence/postgres/repositories/symbol.repository";

export class RankSymbolsJob {
    constructor(
        @Inject(SYMBOL_REPOSITORY_NAME) private symbolRepository: SymbolRepository,
    ) { }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async handle(): Promise<void> {
        const symbolsROE = await this.symbolRepository.findSymbolsWithROE();

        if (symbolsROE.length) {
            for (let symbolROE of symbolsROE) {
                symbolROE.roePosition = symbolsROE.indexOf(symbolROE) + 1;
            }

            await this.symbolRepository.saveAll(symbolsROE);
        }

        const symbolsForwardPE = await this.symbolRepository.findSymbolsWithForwardPE();

        if (symbolsForwardPE.length) {
            for (let symbolForwardPE of symbolsForwardPE) {
                symbolForwardPE.forwardPEPosition = symbolsForwardPE.indexOf(symbolForwardPE) + 1;
            }

            await this.symbolRepository.saveAll(symbolsForwardPE);
        }

        const symbolsToRank = await this.symbolRepository.findSymbolsWithROEAndForwardPE();

        if (symbolsToRank.length) {
            for (let symbolToRank of symbolsToRank) {
                symbolToRank.ranking = symbolToRank.forwardPEPosition + symbolToRank.roePosition;
            }

            await this.symbolRepository.saveAll(symbolsToRank);
        }
    }
}

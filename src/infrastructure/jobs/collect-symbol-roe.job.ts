import { Inject } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { SYMBOL_REPOSITORY_NAME } from "../../domain/repositories/symbol.repository";
import { YahooFinanceAPICliente } from "../api-client/yahoo-finance.api-client";
import { SymbolRepository } from "../persistence/postgres/repositories/symbol.repository";

export class CollectSymbolROEJob {
    constructor(
        @Inject(SYMBOL_REPOSITORY_NAME) private symbolRepository: SymbolRepository,
        private yahooFinanceAPICliente: YahooFinanceAPICliente
    ) { }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async handle(): Promise<void> {
        const symbols = await this.symbolRepository.findSymbolsWithOutROE();

        if (symbols.length) {
            for (let symbol of symbols) {
                const symbolROE = await this.yahooFinanceAPICliente.collectROE(symbol.name);

                if (!symbolROE) {
                    symbol.reason = 'Symbol not found in Yahoo API';

                    await this.symbolRepository.save(symbol);
                } else {
                    symbol.roe = symbolROE;

                    await this.symbolRepository.save(symbol);
                }
            }
        }
    }
}

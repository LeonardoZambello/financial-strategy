import { Inject } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { STOCK_REPOSITORY_NAME } from "../../domain/repositories/symbol.repository";
import { YahooFinanceAPICliente } from "../api-client/yahoo-finance.api-client";
import { StockRepository } from "../persistence/postgres/repositories/stock.repository";

export class CollectStockROEJob {
    constructor(
        @Inject(STOCK_REPOSITORY_NAME) private stockRepository: StockRepository,
        private yahooFinanceAPICliente: YahooFinanceAPICliente
    ) { }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async handle(): Promise<void> {
        if (process.env.ENABLE_JOB_ROE === 'true') {
            const stocks = await this.stockRepository.findStocksWithOutROE();

            if (stocks.length) {
                for (let stock of stocks) {
                    const stockROE = await this.yahooFinanceAPICliente.collectROE(stock.name);

                    if (!stockROE) {
                        stock.reason = 'Stock not found in Yahoo API';

                        await this.stockRepository.save(stock);
                    } else {
                        stock.roe = stockROE;

                        await this.stockRepository.save(stock);
                    }
                }
            }
        }
    }
}

import { Inject } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { STOCK_REPOSITORY_NAME } from "../../domain/repositories/symbol.repository";
import { StockRepository } from "../persistence/postgres/repositories/stock.repository";

export class RankStocksJob {
    constructor(
        @Inject(STOCK_REPOSITORY_NAME) private stockRepository: StockRepository,
    ) { }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async handle(): Promise<void> {
        const stocksROE = await this.stockRepository.findStocksWithROE();

        if (stocksROE.length) {
            for (let stockROE of stocksROE) {
                stockROE.roePosition = stocksROE.indexOf(stockROE) + 1;
            }

            await this.stockRepository.saveAll(stocksROE);
        }

        const stocksForwardPE = await this.stockRepository.findStocksWithForwardPE();

        if (stocksForwardPE.length) {
            for (let stockForwardPE of stocksForwardPE) {
                stockForwardPE.forwardPEPosition = stocksForwardPE.indexOf(stockForwardPE) + 1;
            }

            await this.stockRepository.saveAll(stocksForwardPE);
        }

        const negativeStocksForwardPE = await this.stockRepository.findStocksWithNegativeForwardPE();

        if (negativeStocksForwardPE.length) {
            for (let stockNegativeForwardPE of negativeStocksForwardPE) {
                stockNegativeForwardPE.forwardPEPosition = ((stocksForwardPE.length) + negativeStocksForwardPE.indexOf(stockNegativeForwardPE) + 1);
            }
            
            await this.stockRepository.saveAll(negativeStocksForwardPE);
        }

        const stocksToRank = await this.stockRepository.findStocksWithROEAndForwardPE();

        if (stocksToRank.length) {
            for (let stockToRank of stocksToRank) {
                stockToRank.ranking = stockToRank.forwardPEPosition + stockToRank.roePosition;
            }

            await this.stockRepository.saveAll(stocksToRank);
        }
    }
}

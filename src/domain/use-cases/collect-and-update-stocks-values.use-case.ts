import { Inject, Injectable } from "@nestjs/common";
import { IStockDataCollector, STOCK_DATA_COLLECTOR_NAME } from "../collector/stock-data.collector";
import { IStockRepository, STOCK_REPOSITORY_NAME } from "../repositories/symbol.repository";

@Injectable()
export class CollectAndUpdateStocksValuesUseCase {
    constructor (
        @Inject(STOCK_DATA_COLLECTOR_NAME) private stockDataCollector: IStockDataCollector,
        @Inject(STOCK_REPOSITORY_NAME) private stockRepository: IStockRepository
    ) {}

    async handle(): Promise<void> {
        const stocks = await this.stockDataCollector.collectData();

        for (const stock of stocks) {
            const stockFromDB = await this.stockRepository.findBySymbol(stock.symbol);
            
            if (!stockFromDB) {
                await this.stockRepository.save(stock);

                continue;
            }

            stock.roe === null ? stockFromDB.roe = stockFromDB.roe : stockFromDB.roe = stock.roe;
            stock.forwardPE === null ? stockFromDB.forwardPE = stockFromDB.forwardPE : stockFromDB.forwardPE = stock.forwardPE;

            await this.stockRepository.save(stockFromDB);
        }
    }
}

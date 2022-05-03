import { Inject, Injectable } from "@nestjs/common";
import { Stock } from "../entities/stock.entity";
import { StockNotFound } from "../exceptions/stock-not-found.exception";
import { IStockRepository, STOCK_REPOSITORY_NAME } from "../repositories/symbol.repository";

@Injectable()
export class SaveStockUseCase {
    constructor (
        @Inject(STOCK_REPOSITORY_NAME) private stockRepository: IStockRepository
    ) {}

    async handle(stock: Stock): Promise<void> {
        if(!stock) throw new StockNotFound();

        const stockFromDB = await this.stockRepository.findBySymbol(stock.symbol);

        if (!stockFromDB) {
            return await this.stockRepository.save(stock);
        }

        stockFromDB.roe = stock.roe;
        stockFromDB.forwardPE = stock.forwardPE;

        await this.stockRepository.save(stockFromDB);
    }   
}

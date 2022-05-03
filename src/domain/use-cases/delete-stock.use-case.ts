import { Inject, Injectable } from "@nestjs/common";
import { InvalidStockName } from "../exceptions/invalid-stock-name.exception";
import { StockNotFound } from "../exceptions/stock-not-found.exception";
import { IStockRepository, STOCK_REPOSITORY_NAME } from "../repositories/symbol.repository";

@Injectable()
export class DeleteStockUseCase {
    constructor (
        @Inject(STOCK_REPOSITORY_NAME) private stockRepository: IStockRepository
    ) {}

    async handle(symbol: string): Promise<void> {
        if (!symbol) throw new InvalidStockName();

        const stock = await this.stockRepository.findBySymbol(symbol);

        if (!stock) throw new StockNotFound();

        await this.stockRepository.delete(stock.symbol);
    }
}

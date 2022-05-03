import { Inject, Injectable } from "@nestjs/common";
import { Stock } from "../entities/stock.entity";
import { InvalidStockName } from "../exceptions/invalid-stock-name.exception";
import { StockNotFound } from "../exceptions/stock-not-found.exception";
import { STOCK_REPOSITORY_NAME, IStockRepository } from '../repositories/symbol.repository';

@Injectable()
export class FindStockBySymbolUseCase {
    constructor (
        @Inject(STOCK_REPOSITORY_NAME) private stockRepository: IStockRepository
    ) {}

    async handle(symbol: string): Promise<Stock> {
        if (!symbol) throw new InvalidStockName();
        
        const stock = await this.stockRepository.findBySymbol(symbol);

        if (!stock) throw new StockNotFound();

        return stock;
    }
}

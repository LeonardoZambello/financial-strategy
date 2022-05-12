import { Inject } from "@nestjs/common";
import { InvalidStockName } from "../exceptions/invalid-stock-name.exception";
import { StockIsNotBlacklisted } from "../exceptions/stock-is-not-blacklisted.excepetion";
import { StockNotFound } from "../exceptions/stock-not-found.exception";
import { IStockRepository, STOCK_REPOSITORY_NAME } from "../repositories/symbol.repository";

export class RemoveStockFromBlacklistUseCase {
    constructor (
        @Inject(STOCK_REPOSITORY_NAME) private stockRepository: IStockRepository
    ) {}

    async handle(symbol: string): Promise<void> {
        if(!symbol) throw new InvalidStockName();

        const stockFromDB = await this.stockRepository.findBySymbol(symbol);

        if (!stockFromDB) throw new StockNotFound();

        if(!stockFromDB.blacklistedAt) throw new StockIsNotBlacklisted();

        stockFromDB.blacklistedAt = null;

        await this.stockRepository.save(stockFromDB);
    }
}

import { Inject } from "@nestjs/common";
import { InvalidStockName } from "../exceptions/invalid-stock-name.exception";
import { StockAlreadyBlacklisted } from "../exceptions/stock-is-already-blacklisted.exception";
import { StockNotFound } from "../exceptions/stock-not-found.exception";
import { IStockRepository, STOCK_REPOSITORY_NAME } from "../repositories/symbol.repository";

export class AddStockToBlacklistUseCase {
    constructor (
        @Inject(STOCK_REPOSITORY_NAME) private stockRepository: IStockRepository
    ) {}

    async handle(symbol: string): Promise<void> {
        if(!symbol) throw new InvalidStockName();

        const stockFromDB = await this.stockRepository.findBySymbol(symbol);

        if (!stockFromDB) throw new StockNotFound();

        if(stockFromDB.blacklistedAt) throw new StockAlreadyBlacklisted();

        stockFromDB.blacklistedAt = new Date();

        await this.stockRepository.save(stockFromDB);
    }
}

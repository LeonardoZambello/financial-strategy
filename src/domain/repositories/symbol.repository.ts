/* istanbul ignore file */

import { Stock } from "../entities/stock.entity";
import { PaginationVO } from "../value_objects/pagination.value-object";

export interface IStockRepository {
    save(stock: Stock): Promise<void>;
    findBySymbol(symbol: string): Promise<Stock>;
    findAll(paginationVO: PaginationVO): Promise<[Stock[], Number]>;
    delete(symbol: string): Promise<void>;
}

export const STOCK_REPOSITORY_NAME = 'IStockRepository'

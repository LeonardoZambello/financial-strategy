/* istanbul ignore file */

import { Stock } from "../entities/stock.entity";

export interface IStockDataCollector {
    collectData(): Promise<Stock[]>;
}

export const STOCK_DATA_COLLECTOR_NAME = 'IStockDataCollector'
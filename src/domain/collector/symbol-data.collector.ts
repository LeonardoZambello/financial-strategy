/* istanbul ignore file */

import { Symbol } from "../entities/symbol.entity";

export interface ISymbolDataCollector {
    collectData(): Promise<Symbol[]>;
}

export const SYMBOL_DATA_COLLECTOR_NAME = 'ISymbolDataCollector'
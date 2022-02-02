/* istanbul ignore file */

import { Symbol } from "../entities/symbol.entity";

export interface ISymbolRepository {
    save(symbols: Symbol): Promise<void>;
    findByName(name: string): Promise<Symbol>;
}

export const SYMBOL_REPOSITORY_NAME = 'ISymbolRepository'

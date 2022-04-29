/* istanbul ignore file */

import { Symbol } from "../entities/symbol.entity";
import { PaginationVO } from "../value_objects/pagination.value-object";

export interface ISymbolRepository {
    save(symbols: Symbol): Promise<void>;
    findByName(name: string): Promise<Symbol>;
    findAll(paginationVO: PaginationVO): Promise<[Symbol[], Number]>;
    delete(name: string): Promise<void>;
}

export const SYMBOL_REPOSITORY_NAME = 'ISymbolRepository'

import { Inject, Injectable } from "@nestjs/common";
import { Symbol } from "../entities/symbol.entity";
import { SymbolsNotFound } from "../exceptions/symbols-not-found.exception";
import { ISymbolRepository, SYMBOL_REPOSITORY_NAME } from "../repositories/symbol.repository";

@Injectable()
export class SaveSymbolsUseCase {
    constructor (
        @Inject(SYMBOL_REPOSITORY_NAME) private symbolRepository: ISymbolRepository
    ) {}

    async handle(symbols: Symbol[]): Promise<void> {
        if(!symbols.length) throw new SymbolsNotFound();

        const validSymbols = symbols.filter(symbol => symbol.name.length === 5);

        for (let symbol of validSymbols) {
            const symbolFromDb = await this.symbolRepository.findByName(symbol.name);

            if(!symbolFromDb) await this.symbolRepository.save(symbol);
        }
    }   
}

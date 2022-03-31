import { Inject, Injectable } from "@nestjs/common";
import { Symbol } from "../entities/symbol.entity";
import { InvalidSymbolName } from "../exceptions/invalid-symbol-name.exception";
import { SymbolsNotFound } from "../exceptions/symbol-not-found.exception";
import { SYMBOL_REPOSITORY_NAME, ISymbolRepository } from '../repositories/symbol.repository';

@Injectable()
export class FindSymbolByNameUseCase {
    constructor (
        @Inject(SYMBOL_REPOSITORY_NAME) private symbolRepository: ISymbolRepository
    ) {}

    async handle(name: string): Promise<Symbol> {
        if (!name) throw new InvalidSymbolName();
        
        const symbol = await this.symbolRepository.findByName(name);

        if (!symbol) throw new SymbolsNotFound();

        return symbol;
    }
}

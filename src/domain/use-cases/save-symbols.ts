import { Inject, Injectable } from "@nestjs/common";
import { Symbol } from "../entities/symbol.entity";
import { SymbolNotFound } from "../exceptions/symbol-not-found.exception";
import { ISymbolRepository, SYMBOL_REPOSITORY_NAME } from "../repositories/symbol.repository";

@Injectable()
export class SaveSymbolsUseCase {
    constructor (
        @Inject(SYMBOL_REPOSITORY_NAME) private symbolRepository: ISymbolRepository
    ) {}

    async handle(symbol: Symbol): Promise<void> {
        if(!symbol) throw new SymbolNotFound();

        const symbolFromDB = await this.symbolRepository.findByName(symbol.name);

        if (!symbolFromDB) {
            return await this.symbolRepository.save(symbol);
        }

        symbolFromDB.roe = symbol.roe;
        symbolFromDB.forwardPE = symbol.forwardPE;

        await this.symbolRepository.save(symbolFromDB);
    }   
}

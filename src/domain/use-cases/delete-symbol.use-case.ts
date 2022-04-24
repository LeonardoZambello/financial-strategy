import { Inject, Injectable } from "@nestjs/common";
import { InvalidSymbolName } from "../exceptions/invalid-symbol-name.exception";
import { SymbolNotFound } from "../exceptions/symbol-not-found.exception";
import { ISymbolRepository, SYMBOL_REPOSITORY_NAME } from "../repositories/symbol.repository";

@Injectable()
export class DeleteSymbolUseCase {
    constructor (
        @Inject(SYMBOL_REPOSITORY_NAME) private symbolRepository: ISymbolRepository
    ) {}

    async handle(name: string): Promise<void> {
        if (!name) throw new InvalidSymbolName();

        const symbol = await this.symbolRepository.findByName(name);

        if (!symbol) throw new SymbolNotFound();

        await this.symbolRepository.delete(name);
    }
}

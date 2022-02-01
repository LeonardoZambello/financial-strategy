import { Injectable } from "@nestjs/common";
import { SaveSymbolsUseCase } from "../../domain/use-cases/save-symbols";
import { SymbolNameListDTO } from "../dto/symbol-name-list.dto";
import { SymbolMapper } from "../mappers/symbol.mapper";

@Injectable()
export class SymbolService {
    constructor(
        private saveSymbolUseCase: SaveSymbolsUseCase,
        private symbolMapper: SymbolMapper
    ) {}

    async save(symbolNameListDTO: SymbolNameListDTO): Promise<void> {
        if(!symbolNameListDTO) return null;

        const symbols = this.symbolMapper.createDTOtoDomain(symbolNameListDTO);

        await this.saveSymbolUseCase.handle(symbols);
    }
}

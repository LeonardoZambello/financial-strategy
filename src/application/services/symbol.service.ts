import { Injectable } from "@nestjs/common";
import { FindSymbolByNameUseCase } from "../../domain/use-cases/find-symbol-by-name";
import { SaveSymbolsUseCase } from "../../domain/use-cases/save-symbols";
import { SymbolNameListDTO } from "../dto/symbol-name-list.dto";
import { SymbolMapper } from "../mappers/symbol.mapper";
import { FindSymbolByNameDTO } from "../dto/find-symbol-by-name.dto";

@Injectable()
export class SymbolService {
    constructor(
        private saveSymbolUseCase: SaveSymbolsUseCase,
        private findSymbolByNameUseCase: FindSymbolByNameUseCase,
        private symbolMapper: SymbolMapper
    ) { }

    async save(symbolNameListDTO: SymbolNameListDTO): Promise<void> {
        if (!symbolNameListDTO) return null;

        const symbols = this.symbolMapper.createDTOtoDomain(symbolNameListDTO);

        await this.saveSymbolUseCase.handle(symbols);
    }
    async findSymbolByName(name: string): Promise<FindSymbolByNameDTO> {
        if (!name) return null;

        const symbol = await this.findSymbolByNameUseCase.handle(name);

        const dto = this.symbolMapper.createDomainToDTO(symbol);

        return dto;
    }
}

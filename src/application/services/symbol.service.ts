import { Inject, Injectable } from "@nestjs/common";
import { FindSymbolByNameUseCase } from "../../domain/use-cases/find-symbol-by-name";
import { SaveSymbolsUseCase } from "../../domain/use-cases/save-symbols";
import { SymbolNameListDTO } from "../dto/symbol-name-list.dto";
import { SymbolMapper } from "../mappers/symbol.mapper";
import { FindSymbolByNameDTO } from "../dto/find-symbol-by-name.dto";
import { PaginationVO } from "../../domain/value_objects/pagination.value-object";
import { REQUEST } from "@nestjs/core";
import { Request } from 'express';
import { FindAllSymbolsUseCase } from "../../domain/use-cases/find-all-symbols.use-case";

@Injectable()
export class SymbolService {
    constructor(
        private saveSymbolUseCase: SaveSymbolsUseCase,
        private findSymbolByNameUseCase: FindSymbolByNameUseCase,
        private findAllSymbolsUseCase: FindAllSymbolsUseCase,
        private symbolMapper: SymbolMapper,
        @Inject(REQUEST) private request: Request
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
    async findAllSymbols(): Promise<FindSymbolByNameDTO[]> {
        const pagination = Object.assign(new PaginationVO, this.request.query);

        const symbols = await this.findAllSymbolsUseCase.handle(pagination);

        if (!symbols) return null;

        const findSymbolByNameDTO = symbols.map(this.symbolMapper.createDomainToDTO);

        return findSymbolByNameDTO;
    }
}

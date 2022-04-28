import { Inject, Injectable } from "@nestjs/common";
import { FindSymbolByNameUseCase } from "../../domain/use-cases/find-symbol-by-name";
import { SaveSymbolsUseCase } from "../../domain/use-cases/save-symbols";
import { SymbolMapper } from "../mappers/symbol.mapper";
import { FindSymbolByNameDTO } from "../dto/find-symbol-by-name.dto";
import { PaginationVO } from "../../domain/value_objects/pagination.value-object";
import { REQUEST } from "@nestjs/core";
import { Request } from 'express';
import { FindAllSymbolsUseCase } from "../../domain/use-cases/find-all-symbols.use-case";
import { CreateOrUpdateSymbolDTO } from "../dto/create-or-update-symbol.dto";
import { DeleteSymbolUseCase } from "../../domain/use-cases/delete-symbol.use-case";
import { CollectAndUpdateSymbolsValuesUseCase } from "../../domain/use-cases/collect-and-update-symbols-values.use-case";
import { RequiredQueryStrings } from "../rest/query-strings/required-query-strings";

@Injectable()
export class SymbolService {
    constructor(
        private saveSymbolUseCase: SaveSymbolsUseCase,
        private findSymbolByNameUseCase: FindSymbolByNameUseCase,
        private findAllSymbolsUseCase: FindAllSymbolsUseCase,
        private deleteSymbolUseCase: DeleteSymbolUseCase,
        private collectAndUpdateSymbolsValuesUseCase: CollectAndUpdateSymbolsValuesUseCase,
        private symbolMapper: SymbolMapper,
        @Inject(REQUEST) private request: Request
    ) { }

    async save(createOrUpdateSymbolDTO: CreateOrUpdateSymbolDTO): Promise<void> {
        if (!createOrUpdateSymbolDTO) return null;

        const symbol = this.symbolMapper.createDTOtoDomain(createOrUpdateSymbolDTO);

        await this.saveSymbolUseCase.handle(symbol);
    }
    async findSymbolByName(name: string): Promise<FindSymbolByNameDTO> {
        if (!name) return null;

        const symbol = await this.findSymbolByNameUseCase.handle(name);

        const dto = this.symbolMapper.createDomainToDTO(symbol);

        return dto;
    }
    async findAllSymbols(query: RequiredQueryStrings): Promise<[FindSymbolByNameDTO[], Number, Number]> {
        const pagination = Object.assign(new PaginationVO, query);

        const [symbols, count] = await this.findAllSymbolsUseCase.handle(pagination);

        if (!symbols) return null;

        const findSymbolByNameDTO = symbols.map(this.symbolMapper.createDomainToDTO);

        let pageCount = Math.ceil(count.valueOf() / query.size)

        return [findSymbolByNameDTO, count, pageCount];
    }
    async delete(name: string): Promise<void> {
        if (!name) return null;

        await this.deleteSymbolUseCase.handle(name);
    }
    async createOrUpdateSymbols(): Promise<void> {
        await this.collectAndUpdateSymbolsValuesUseCase.handle();
    }
}

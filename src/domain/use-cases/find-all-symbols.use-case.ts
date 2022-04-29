import { Inject, Injectable } from "@nestjs/common";
import { Symbol } from "../entities/symbol.entity";
import { ISymbolRepository, SYMBOL_REPOSITORY_NAME } from "../repositories/symbol.repository";
import { PaginationVO } from "../value_objects/pagination.value-object";

@Injectable()
export class FindAllSymbolsUseCase {
    constructor(
        @Inject(SYMBOL_REPOSITORY_NAME) private symbolRepository: ISymbolRepository
    ) { }

    async handle(paginationVO: PaginationVO): Promise<[Symbol[], Number]> {
        return await this.symbolRepository.findAll(paginationVO);
    }
}

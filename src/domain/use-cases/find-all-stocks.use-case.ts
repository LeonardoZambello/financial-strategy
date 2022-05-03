import { Inject, Injectable } from "@nestjs/common";
import { Stock } from "../entities/stock.entity";
import { IStockRepository, STOCK_REPOSITORY_NAME } from "../repositories/symbol.repository";
import { PaginationVO } from "../value_objects/pagination.value-object";

@Injectable()
export class FindAllStocksUseCase {
    constructor(
        @Inject(STOCK_REPOSITORY_NAME) private stockRepository: IStockRepository
    ) { }

    async handle(paginationVO: PaginationVO): Promise<[Stock[], Number]> {
        return await this.stockRepository.findAll(paginationVO);
    }
}

import { Inject, Injectable } from "@nestjs/common";
import { FindStockBySymbolUseCase } from "../../domain/use-cases/find-stock-by-symbol";
import { SaveStockUseCase } from "../../domain/use-cases/save-stocks";
import { StockMapper } from "../mappers/stock.mapper";
import { FindStockBySymbolDTO } from "../dto/find-stock-by-name.dto";
import { PaginationVO } from "../../domain/value_objects/pagination.value-object";
import { REQUEST } from "@nestjs/core";
import { Request } from 'express';
import { FindAllStocksUseCase } from "../../domain/use-cases/find-all-stocks.use-case";
import { CreateOrUpdateStockDTO } from "../dto/create-or-update-stock.dto";
import { DeleteStockUseCase } from "../../domain/use-cases/delete-stock.use-case";
import { CollectAndUpdateStocksValuesUseCase } from "../../domain/use-cases/collect-and-update-stocks-values.use-case";
import { RequiredQueryStrings } from "../rest/query-strings/required-query-strings";
import { RankingStockDTO } from "../dto/ranking-stock.dto";

@Injectable()
export class StockService {
    constructor(
        private saveStockUseCase: SaveStockUseCase,
        private findStockBySymbolUseCase: FindStockBySymbolUseCase,
        private findAllStocksUseCase: FindAllStocksUseCase,
        private deleteStockUseCase: DeleteStockUseCase,
        private collectAndUpdateStocksValuesUseCase: CollectAndUpdateStocksValuesUseCase,
        private stockMapper: StockMapper,
        @Inject(REQUEST) private request: Request
    ) { }

    async save(createOrUpdateStockDTO: CreateOrUpdateStockDTO): Promise<void> {
        if (!createOrUpdateStockDTO) return null;

        const symbol = this.stockMapper.createDTOtoDomain(createOrUpdateStockDTO);

        await this.saveStockUseCase.handle(symbol);
    }
    async findStockBySymbol(symbol: string): Promise<FindStockBySymbolDTO> {
        if (!symbol) return null;

        const stock = await this.findStockBySymbolUseCase.handle(symbol);

        const dto = this.stockMapper.createDomainToDTO(stock);

        return dto;
    }
    async findAllSymbols(query: RequiredQueryStrings): Promise<[RankingStockDTO[], Number, Number]> {
        const pagination = Object.assign(new PaginationVO, query);

        const [stocks, count] = await this.findAllStocksUseCase.handle(pagination);

        if (!stocks) return null;

        const findStockByNameDTO = stocks.map(this.stockMapper.createDomainToRankingDTO);

        let pageCount = Math.ceil(count.valueOf() / query.size)

        return [findStockByNameDTO, count, pageCount];
    }
    async delete(symbol: string): Promise<void> {
        if (!symbol) return null;

        await this.deleteStockUseCase.handle(symbol);
    }
    async createOrUpdateStocks(): Promise<void> {
        await this.collectAndUpdateStocksValuesUseCase.handle();
    }
}

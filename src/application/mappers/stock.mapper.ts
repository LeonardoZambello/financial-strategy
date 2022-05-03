import { Injectable, Scope } from "@nestjs/common";
import { Stock } from "../../domain/entities/stock.entity";
import { CreateOrUpdateStockDTO } from "../dto/create-or-update-stock.dto";
import { FindStockBySymbolDTO } from "../dto/find-stock-by-name.dto";
import { RankingStockDTO } from "../dto/ranking-stock.dto";

@Injectable({
    scope: Scope.TRANSIENT
})
export class StockMapper {
    createDTOtoDomain(dto: CreateOrUpdateStockDTO): Stock {
        if(!dto) return null;

        const stock = new Stock();
        stock.name = dto.name;
        stock.symbol = dto.symbol;
        stock.roe = dto.roe;
        stock.forwardPE = dto.PE;

        return stock;
    }
    createDomainToDTO(stock: Stock): FindStockBySymbolDTO {
        const dto = new FindStockBySymbolDTO();
        dto.id = stock.id;
        dto.name = stock.name;
        dto.symbol = stock.symbol;
        dto.roe = stock.roe ? Number(stock.roe) : null;
        dto.forwardPE = stock.forwardPE ? Number(stock.forwardPE) : null;
        dto.ranking = stock.ranking ? Number(stock.ranking) : null;
        dto.reason = stock.reason;
        return dto;
    }
    createDomainToRankingDTO(stock: Stock): RankingStockDTO {
      const dto = new RankingStockDTO();
      dto.symbol = stock.symbol;
      dto.name = stock.name;
      dto.ranking = Number(stock.ranking);
      dto.rankingRoe = Number(stock.roePosition);
      dto.rankingPE = Number(stock.forwardPEPosition);
      dto.roe = Number(stock.roe);
      dto.forwardPE = Number(stock.forwardPE);
      dto.updatedAt = stock.updatedAt;
      return dto;
    }
}

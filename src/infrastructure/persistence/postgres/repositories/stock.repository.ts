/* istanbul ignore file */

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Stock } from "../../../../domain/entities/stock.entity";
import { IStockRepository } from "src/domain/repositories/symbol.repository";
import { PaginationVO } from "src/domain/value_objects/pagination.value-object";
import { IsNull, Not, Repository, MoreThan, LessThan } from "typeorm";
import { StockSchema } from "../schema/stock.schema";

@Injectable()
export class StockRepository implements IStockRepository {
    constructor(
        @InjectRepository(StockSchema) private stockRepository: Repository<StockSchema>
    ) { }

    async delete(symbol: string): Promise<void> {
        await this.stockRepository.delete({
            name: symbol
        })
    }

    async findAll(paginationVO: PaginationVO): Promise<[Stock[], Number]> {
        const {
            page,
            size,
            sort,
            order,
            blacklist
        } = paginationVO;

        const orderOptions = {  };
        orderOptions[sort] = order;

        return await this.stockRepository.findAndCount(
          {
            where: {
              ranking: Not(IsNull()),
              roe: Not(IsNull()),
              forwardPE: Not(IsNull()),
              blacklistedAt: !blacklist ? IsNull() : Not(IsNull())
             },
            order: orderOptions,
            take: size,
            skip: (page - 1) * size
          }
        );
    }

    async saveAll(stocks: Stock[]): Promise<void> {
        await this.stockRepository.save(stocks);
    }

    async save(stock: Stock): Promise<void> {
        await this.stockRepository.save(stock);
    }

    async findBySymbol(symbol: string): Promise<Stock> {
        return await this.stockRepository.findOne({
            where: {
                symbol: symbol
            }
        })
    }

    async findStocksWithOutForwardPE(): Promise<Stock[]> {
        return await this.stockRepository.find({
            where: {
                reason: IsNull(),
                forwardPE: IsNull()
            },
            take: 10
        });
    }

    async findStocksWithOutROE(): Promise<Stock[]> {
        return await this.stockRepository.find({
            where: {
                reason: IsNull(),
                roe: IsNull()
            },
            take: 10
        });
    }

    async findStocksWithROE(): Promise<Stock[]> {
        return await this.stockRepository.find({
            where: {
                roe: Not(IsNull()),
                forwardPE: Not(IsNull()),
                reason: IsNull(),
                blacklistedAt: IsNull()
            },
            order: {
                roe: "DESC"
            }
        })
    }

    async findStocksWithForwardPE(): Promise<Stock[]> {
        return await this.stockRepository.find({
            where: {
                forwardPE: Not(IsNull()) && MoreThan(0),
                roe: Not(IsNull()),
                reason: IsNull(),
                blacklistedAt: IsNull()
            },
            order: {
                forwardPE: "ASC"
            }
        })
    }

    async findStocksWithNegativeForwardPE(): Promise<Stock[]> {
        return await this.stockRepository.find({
            where: {
                forwardPE: Not(IsNull()) && LessThan(0),
                roe: Not(IsNull()),
                reason: IsNull(),
                blacklistedAt: IsNull()
            },
            order: {
                forwardPE: "DESC"
            }
        })
    }

    async findStocksWithROEAndForwardPE(): Promise<Stock[]> {
        return await this.stockRepository.find({
            where: {
                forwardPEPosition: Not(IsNull()),
                roePosition: Not(IsNull()),
                reason: IsNull(),
                blacklistedAt: IsNull()
            }
        })
    }

    async findStocksByRankingDesc(): Promise<Stock[]> {
        return await this.stockRepository.find({
            where: {
                ranking: Not(IsNull)
            },
            order: {
                ranking: 'ASC'
            }
        })
    }
}

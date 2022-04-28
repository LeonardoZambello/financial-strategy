/* istanbul ignore file */

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Symbol } from "src/domain/entities/symbol.entity";
import { ISymbolRepository } from "src/domain/repositories/symbol.repository";
import { PaginationVO } from "src/domain/value_objects/pagination.value-object";
import { IsNull, Not, Repository, MoreThan, LessThan } from "typeorm";
import { SymbolSchema } from "../schema/symbol.schema";

@Injectable()
export class SymbolRepository implements ISymbolRepository {
    constructor(
        @InjectRepository(SymbolSchema) private symbolRepository: Repository<SymbolSchema>
    ) { }

    async delete(name: string): Promise<void> {
        await this.symbolRepository.delete({
            name: name
        })
    }

    async findAll(paginationVO: PaginationVO): Promise<[Symbol[], Number]> {
        const {
            page,
            size,
            sort,
            order
        } = paginationVO;

        const orderOptions = {  };
        orderOptions[sort] = order;

        return await this.symbolRepository.findAndCount(
          {
            where: {
              ranking: Not(IsNull()),
              roe: Not(IsNull()),
              forwardPE: Not(IsNull())
             },
            order: orderOptions,
            take: size,
            skip: (page - 1) * size
          }
        );
    }

    async saveAll(symbols: Symbol[]): Promise<void> {
        await this.symbolRepository.save(symbols);
    }

    async save(symbol: Symbol): Promise<void> {
        await this.symbolRepository.save(symbol);
    }

    async findByName(name: string): Promise<Symbol> {
        return await this.symbolRepository.findOne({
            where: {
                name: name
            }
        })
    }

    async findSymbolsWithOutForwardPE(): Promise<Symbol[]> {
        return await this.symbolRepository.find({
            where: {
                reason: IsNull(),
                forwardPE: IsNull()
            },
            take: 10
        });
    }

    async findSymbolsWithOutROE(): Promise<Symbol[]> {
        return await this.symbolRepository.find({
            where: {
                reason: IsNull(),
                roe: IsNull()
            },
            take: 10
        });
    }

    async findSymbolsWithROE(): Promise<Symbol[]> {
        return await this.symbolRepository.find({
            where: {
                roe: Not(IsNull()),
                reason: IsNull()
            },
            order: {
                roe: "DESC"
            }
        })
    }

    async findSymbolsWithForwardPE(): Promise<Symbol[]> {
        return await this.symbolRepository.find({
            where: {
                forwardPE: Not(IsNull()) && MoreThan(0),
                reason: IsNull()
            },
            order: {
                forwardPE: "ASC"
            }
        })
    }

    async findSymbolsWithNegativeForwardPE(): Promise<Symbol[]> {
        return await this.symbolRepository.find({
            where: {
                forwardPE: Not(IsNull()) && LessThan(0),
                reason: IsNull()
            },
            order: {
                forwardPE: "DESC"
            }
        })
    }

    async findSymbolsWithROEAndForwardPE(): Promise<Symbol[]> {
        return await this.symbolRepository.find({
            where: {
                forwardPEPosition: Not(IsNull()),
                roePosition: Not(IsNull()),
                reason: IsNull()
            }
        })
    }

    async findSymbolsByRankingDesc(): Promise<Symbol[]> {
        return await this.symbolRepository.find({
            where: {
                ranking: Not(IsNull)
            },
            order: {
                ranking: 'ASC'
            }
        })
    }
}

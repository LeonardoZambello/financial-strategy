/* istanbul ignore file */

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Symbol } from "src/domain/entities/symbol.entity";
import { ISymbolRepository } from "src/domain/repositories/symbol.repository";
import { PaginationVO } from "src/domain/value_objects/pagination.value-object";
import { IsNull, Not, Repository } from "typeorm";
import { SymbolSchema } from "../schema/symbol.schema";

@Injectable()
export class SymbolRepository implements ISymbolRepository {
    constructor(
        @InjectRepository(SymbolSchema) private symbolRepository: Repository<SymbolSchema>
    ) { }

    async findAll(paginationVO: PaginationVO): Promise<Symbol[]> {
        const {
            limit,
            skip,
            forwardPE,
            roe
        } = paginationVO;

        let queryBase = this.symbolRepository.createQueryBuilder('symbol')
            .skip(Number(skip ?? 0))
            .take(Number(limit ?? 25))
            .orderBy('symbol.createdAt', 'DESC');


        if (!forwardPE && !roe) queryBase = queryBase.andWhere(`symbol.roe is null`).andWhere(`symbol.forwardPE is null`);

        if (forwardPE && !roe) queryBase = queryBase.andWhere(`symbol.roe is null`).andWhere(`symbol.forwardPE <= :forwardPE`, { forwardPE: forwardPE });

        if (!forwardPE && roe) queryBase = queryBase.andWhere(`symbol.roe >= :roe`, { roe: roe }).andWhere(`symbol.forwardPE is null`);

        if (forwardPE && roe) queryBase = queryBase.andWhere(`symbol.roe >= :roe`, { roe: roe }).andWhere(`symbol.forwardPE <= :forwardPE`, { forwardPE: forwardPE });

        const symbols = await queryBase.getMany();

        return symbols;
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
                forwardPE: Not(IsNull()),
                reason: IsNull()
            },
            order: {
                forwardPE: "ASC"
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

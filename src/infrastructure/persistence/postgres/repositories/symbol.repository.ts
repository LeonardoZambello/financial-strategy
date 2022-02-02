/* istanbul ignore file */

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Symbol } from "src/domain/entities/symbol.entity";
import { ISymbolRepository } from "src/domain/repositories/symbol.repository";
import { IsNull, Repository } from "typeorm";
import { isNull } from "util";
import { SymbolSchema } from "../schema/symbol.schema";

@Injectable()
export class SymbolRepository implements ISymbolRepository {
    constructor (
        @InjectRepository(SymbolSchema) private symbolRepository: Repository<SymbolSchema>
    ) {}

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
}

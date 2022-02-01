/* istanbul ignore file */

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Symbol } from "src/domain/entities/symbol.entity";
import { ISymbolRepository } from "src/domain/repositories/symbol.repository";
import { Repository } from "typeorm";
import { SymbolSchema } from "../schema/symbol.schema";

@Injectable()
export class SymbolRepository implements ISymbolRepository {
    constructor (
        @InjectRepository(SymbolSchema) private symbolRepository: Repository<SymbolSchema>
    ) {}

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
}

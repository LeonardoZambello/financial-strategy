/* istanbul ignore file */

import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { FindSymbolByNameDTO } from "../dto/find-symbol-by-name.dto";
import { SymbolNameListDTO } from "../dto/symbol-name-list.dto";
import { SymbolService } from "../services/symbol.service";

@Controller('symbol')
export class SymbolController {
    constructor(private symbolSerivce: SymbolService) {}

    @Post()
    async save(@Body() symbolNameListDTO: SymbolNameListDTO): Promise<void> {
        return await this.symbolSerivce.save(symbolNameListDTO);
    }
    @Get(':name')
    async findByName(@Param('name') name: string): Promise<FindSymbolByNameDTO> {
        return await this.symbolSerivce.findSymbolByName(name);
    }
}

/* istanbul ignore file */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CreateOrUpdateSymbolDTO } from "src/application/dto/create-or-update-symbol.dto";
import { FindSymbolByNameDTO } from "../../dto/find-symbol-by-name.dto";
import { SymbolService } from "../../services/symbol.service";
import { RequiredQueryStrings } from "../query-strins/required-query-strings";

@Controller('symbol')
export class SymbolController {
    constructor(private symbolSerivce: SymbolService) { }

    @Post()
    async save(@Body() createOrUpdateSymbolDTO: CreateOrUpdateSymbolDTO): Promise<void> {
        return await this.symbolSerivce.save(createOrUpdateSymbolDTO);
    }
    @Get(':name')
    async findByName(@Param('name') name: string): Promise<FindSymbolByNameDTO> {
        return await this.symbolSerivce.findSymbolByName(name);
    }
    @Get()
    async findAll(@Query() query: RequiredQueryStrings): Promise<FindSymbolByNameDTO[]> {
        return await this.symbolSerivce.findAllSymbols();
    }
    @Delete(':name')
    async delete(@Param('name') name: string): Promise<void> {
        await this.symbolSerivce.delete(name);
    }
    @Post('/update')
    async createOrUpdateSymbols(): Promise<void> {
        await this.symbolSerivce.createOrUpdateSymbols();
    }
}

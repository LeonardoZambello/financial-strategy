/* istanbul ignore file */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Response } from "@nestjs/common";
import { CreateOrUpdateSymbolDTO } from "src/application/dto/create-or-update-symbol.dto";
import { FindSymbolByNameDTO } from "../../dto/find-symbol-by-name.dto";
import { SymbolService } from "../../services/symbol.service";
import { RequiredQueryStrings } from "../query-strings/required-query-strings";
import { Response as Res} from "express"

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
    async findAll(@Query() query: RequiredQueryStrings, @Response() res: Res): Promise<Res> {7
        const [symbols, count, pageCount] = await this.symbolSerivce.findAllSymbols(query);

        res.set({
          'x-total-count': count,
          'x-total-pages': pageCount
        }).json(symbols);

        return res;
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

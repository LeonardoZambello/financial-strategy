/* istanbul ignore file */

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Response } from "@nestjs/common";
import { CreateOrUpdateStockDTO } from "src/application/dto/create-or-update-stock.dto";
import { FindStockBySymbolDTO } from "../../dto/find-stock-by-name.dto";
import { StockService } from "../../services/stock.service";
import { RequiredQueryStrings } from "../query-strings/required-query-strings";
import { Response as Res} from "express"

@Controller('stocks')
export class StockController {
    constructor(private stockService: StockService) { }

    @Post()
    public async save(@Body() createOrUpdateStockDTO: CreateOrUpdateStockDTO): Promise<void> {
        return await this.stockService.save(createOrUpdateStockDTO);
    }
    @Post('/update')
    public async createOrUpdateSymbols(): Promise<void> {
        await this.stockService.createOrUpdateStocks();
    }
    @Post(':symbol/blacklist')
    public async addStockToBlacklist(@Param('symbol') symbol: string): Promise<void> {
        await this.stockService.addStockToBlacklist(symbol);
    }
    @Delete(':symbol/blacklist')
    public async removeStockFromBlacklist(@Param('symbol') symbol: string): Promise<void> {
        await this.stockService.removeStockFromBlacklist(symbol);
    }
    @Delete(':symbol')
    public async delete(@Param('symbol') symbol: string): Promise<void> {
        await this.stockService.delete(symbol);
    }
    @Get(':symbol')
    public async findByName(@Param('symbol') symbol: string): Promise<FindStockBySymbolDTO> {
        return await this.stockService.findStockBySymbol(symbol);
    }
    @Get()
    public async findAll(@Query() query: RequiredQueryStrings, @Response() res: Res): Promise<Res> {7
        const [symbols, count, pageCount] = await this.stockService.findAllSymbols(query);

        res.set({
          'x-total-count': count,
          'x-total-pages': pageCount
        }).json(symbols);

        return res;
    }
}

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
    async save(@Body() createOrUpdateStockDTO: CreateOrUpdateStockDTO): Promise<void> {
        return await this.stockService.save(createOrUpdateStockDTO);
    }
    @Get(':symbol')
    async findByName(@Param('symbol') symbol: string): Promise<FindStockBySymbolDTO> {
        return await this.stockService.findStockBySymbol(symbol);
    }
    @Get()
    async findAll(@Query() query: RequiredQueryStrings, @Response() res: Res): Promise<Res> {7
        const [symbols, count, pageCount] = await this.stockService.findAllSymbols(query);

        res.set({
          'x-total-count': count,
          'x-total-pages': pageCount
        }).json(symbols);

        return res;
    }
    @Delete(':name')
    async delete(@Param('name') name: string): Promise<void> {
        await this.stockService.delete(name);
    }
    @Post('/update')
    async createOrUpdateSymbols(): Promise<void> {
        await this.stockService.createOrUpdateStocks();
    }
}

import { Body, Controller, Post } from "@nestjs/common";
import { SymbolNameListDTO } from "../dto/symbol-name-list.dto";
import { SymbolService } from "../services/symbol.service";

@Controller('symbol')
export class SymbolController {
    constructor(private symbolSerivce: SymbolService) {}

    @Post()
    async save(@Body() symbolNameListDTO: SymbolNameListDTO): Promise<void> {
        return await this.symbolSerivce.save(symbolNameListDTO);
    }
}

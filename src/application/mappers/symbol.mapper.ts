import { Injectable, Scope } from "@nestjs/common";
import { Symbol } from "../../domain/entities/symbol.entity";
import { SymbolNameListDTO } from "../dto/symbol-name-list.dto";

@Injectable({
    scope: Scope.TRANSIENT
})
export class SymbolMapper {
    createDTOtoDomain(dto: SymbolNameListDTO): Symbol[] {
        if(!dto) return null;

        const symbols = new Array<Symbol>();

        dto.names.forEach(name => {
            const symbol = new Symbol();
            symbol.name = name.toUpperCase();
            symbols.push(symbol);
        });

        return symbols;
    }
}

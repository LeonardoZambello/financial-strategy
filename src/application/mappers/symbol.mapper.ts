import { Injectable, Scope } from "@nestjs/common";
import { Symbol } from "../../domain/entities/symbol.entity";
import { FindSymbolByNameDTO } from "../dto/find-symbol-by-name.dto";
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
    createDomainToDTO(symbol: Symbol): FindSymbolByNameDTO {
        const dto = new FindSymbolByNameDTO();
        dto.id = symbol.id;
        dto.name = symbol.name;
        dto.roe = symbol.roe;
        dto.forwardPE = symbol.forwardPE;
        dto.ranking = symbol.ranking;
        dto.reason = symbol.reason;
        return dto;
    }
}

import { Injectable, Scope } from "@nestjs/common";
import { Symbol } from "../../domain/entities/symbol.entity";
import { CreateOrUpdateSymbolDTO } from "../dto/create-or-update-symbol.dto";
import { FindSymbolByNameDTO } from "../dto/find-symbol-by-name.dto";
import { SymbolNameListDTO } from "../dto/symbol-name-list.dto";

@Injectable({
    scope: Scope.TRANSIENT
})
export class SymbolMapper {
    createDTOtoDomain(dto: CreateOrUpdateSymbolDTO): Symbol {
        if(!dto) return null;

        const symbol = new Symbol();
        symbol.name = dto.name;
        symbol.roe = dto.roe;
        symbol.forwardPE = dto.PE;

        return symbol;
    }
    createDomainToDTO(symbol: Symbol): FindSymbolByNameDTO {
        const dto = new FindSymbolByNameDTO();
        dto.id = symbol.id;
        dto.name = symbol.name;
        dto.roe = symbol.roe ? Number(symbol.roe) : null;
        dto.forwardPE = symbol.forwardPE ? Number(symbol.forwardPE) : null;
        dto.ranking = symbol.ranking ? Number(symbol.ranking) : null;
        dto.reason = symbol.reason;
        return dto;
    }
}

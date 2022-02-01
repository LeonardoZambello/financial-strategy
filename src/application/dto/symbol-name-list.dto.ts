import { IsNotEmpty, IsNotEmptyObject, Length, MaxLength, MinLength } from "class-validator";

export class SymbolNameListDTO {
    @Length(5, 5, {
        each: true
    })
    @IsNotEmptyObject()
    names: string[]
}

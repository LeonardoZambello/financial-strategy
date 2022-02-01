import { Length, ArrayNotEmpty } from "class-validator";

export class SymbolNameListDTO {
    @Length(5, 5, {
        each: true
    })
    @ArrayNotEmpty()
    names: string[]
}

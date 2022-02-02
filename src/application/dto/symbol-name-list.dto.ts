import { ArrayNotEmpty, IsString } from "class-validator";

export class SymbolNameListDTO {
    @ArrayNotEmpty()
    @IsString({
        each: true
    })
    names: string[]
}

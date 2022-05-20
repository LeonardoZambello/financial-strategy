import { ArrayNotEmpty, IsString } from "class-validator";

export class StockNameListDTO {
    @ArrayNotEmpty()
    @IsString({
        each: true
    })
    names: string[]
}

import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateOrUpdateSymbolDTO {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    roe: number;

    @IsNotEmpty()
    @IsNumber()
    PE: number;
}

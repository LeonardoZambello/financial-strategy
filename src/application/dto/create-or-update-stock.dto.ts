import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateOrUpdateStockDTO {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    symbol: string;

    @IsNotEmpty()
    @IsNumber()
    roe: number;

    @IsNotEmpty()
    @IsNumber()
    PE: number;
}

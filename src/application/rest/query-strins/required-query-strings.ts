import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, Max, Min } from "class-validator";

export class RequiredQueryStrings {
  @IsNotEmpty()
  @IsInt()
  @Max(100)
  @Min(0)
  @Transform(value => {
    return parseInt(value.value)
  })
  limit: number = 25;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Transform(value => {
    return parseInt(value.value)
  })
  skip: number = 0;

  @IsOptional()
  @IsNumber()
  @Transform(value => {
    return Number(value.value)
  })
  roe: number;

  @IsOptional()
  @IsNumber()
  @Transform(value => {
    return Number(value.value)
  })
  forwardPE: number;
}

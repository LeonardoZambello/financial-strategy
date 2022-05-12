import { Transform } from "class-transformer";
import { IsBoolean, IsBooleanString, IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { OrderEnum } from "../../../domain/entities/order.enum";
import { SortOptionsEnum } from "../../../domain/entities/sort-options.enum";

export class RequiredQueryStrings {

  @IsOptional()
  @IsInt()
  @Max(100)
  @Min(1)
  @Transform(value => {
    return parseInt(value.value)
  })
  size: number = 25;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(value => {
    return parseInt(value.value)
  })
  page: number = 1;

  @IsOptional()
  @IsString()
  @IsEnum(SortOptionsEnum)
  sort: SortOptionsEnum = SortOptionsEnum.RANKING;

  @IsOptional()
  @IsString()
  @IsEnum(OrderEnum)
  order: OrderEnum = OrderEnum.ASC

  @IsOptional()
  @IsBoolean()
  @Transform(value => {
    return value.value === 'true'
  })
  blacklist: boolean = false
}

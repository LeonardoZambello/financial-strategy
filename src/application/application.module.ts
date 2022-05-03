/* istanbul ignore file */

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DomainModule } from "../domain/domain.module";
import { StockMapper } from "./mappers/stock.mapper";
import { StockController } from "./rest/controllers/stock.controller";
import { StockService } from "./services/stock.service";

@Module({
	imports: [
		ConfigModule.forRoot(),
		DomainModule,
	],
	controllers: [StockController],
	providers: [
		StockService,
		StockMapper
	]
})
export class ApplicationModule {}
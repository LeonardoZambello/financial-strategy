/* istanbul ignore file */

import { Global, Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { STOCK_DATA_COLLECTOR_NAME } from "../domain/collector/stock-data.collector";
import { STOCK_REPOSITORY_NAME } from "../domain/repositories/symbol.repository";
import { MeusDividendosAPIClient } from "./api-client/meus-dividendos.api-client";
import { YahooFinanceAPICliente } from "./api-client/yahoo-finance.api-client";
import { CollectStockForwardPEJob } from "./jobs/collect-stock-forwardpe.job";
import { CollectStockROEJob } from "./jobs/collect-stock-roe.job";
import { RankStocksJob } from "./jobs/rank-stocks.job";
import TypeOrmConnectionOptions from "./persistence/postgres/config/config-connection";
import { StockRepository } from "./persistence/postgres/repositories/stock.repository";
import { StockSchema } from "./persistence/postgres/schema/stock.schema";

@Global()
@Module({
	imports: [
		TypeOrmModule.forRoot(TypeOrmConnectionOptions),
		TypeOrmModule.forFeature([
			StockSchema
		]),
		ScheduleModule.forRoot(),
	],
	providers: [
		{
			provide: STOCK_REPOSITORY_NAME,
			useClass: StockRepository
		},
		{
			provide: STOCK_DATA_COLLECTOR_NAME,
			useClass: MeusDividendosAPIClient
		},
		CollectStockForwardPEJob,
		CollectStockROEJob,
		RankStocksJob,
		YahooFinanceAPICliente,
	],
	controllers: [],
	exports: [STOCK_REPOSITORY_NAME, STOCK_DATA_COLLECTOR_NAME, CollectStockForwardPEJob, CollectStockROEJob, RankStocksJob, YahooFinanceAPICliente],
})
export class InfrastructureModule {}
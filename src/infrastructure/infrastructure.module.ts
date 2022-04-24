/* istanbul ignore file */

import { Global, Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SYMBOL_DATA_COLLECTOR_NAME } from "src/domain/collector/symbol-data.collector";
import { SYMBOL_REPOSITORY_NAME } from "../domain/repositories/symbol.repository";
import { MeusDividendosAPIClient } from "./api-client/meus-dividendos.api-client";
import { YahooFinanceAPICliente } from "./api-client/yahoo-finance.api-client";
import { CollectSymbolForwardPEJob } from "./jobs/collect-symbol-forwardpe.job";
import { CollectSymbolROEJob } from "./jobs/collect-symbol-roe.job";
import { RankSymbolsJob } from "./jobs/rank-symbols.job";
import TypeOrmConnectionOptions from "./persistence/postgres/config/config-connection";
import { SymbolRepository } from "./persistence/postgres/repositories/symbol.repository";
import { SymbolSchema } from "./persistence/postgres/schema/symbol.schema";

@Global()
@Module({
	imports: [
		TypeOrmModule.forRoot(TypeOrmConnectionOptions),
		TypeOrmModule.forFeature([
			SymbolSchema
		]),
		ScheduleModule.forRoot(),
	],
	providers: [
		{
			provide: SYMBOL_REPOSITORY_NAME,
			useClass: SymbolRepository
		},
		{
			provide: SYMBOL_DATA_COLLECTOR_NAME,
			useClass: MeusDividendosAPIClient
		},
		CollectSymbolForwardPEJob,
		CollectSymbolROEJob,
		RankSymbolsJob,
		YahooFinanceAPICliente,
	],
	controllers: [],
	exports: [SYMBOL_REPOSITORY_NAME, SYMBOL_DATA_COLLECTOR_NAME, CollectSymbolForwardPEJob, CollectSymbolROEJob, RankSymbolsJob, YahooFinanceAPICliente],
})
export class InfrastructureModule {}
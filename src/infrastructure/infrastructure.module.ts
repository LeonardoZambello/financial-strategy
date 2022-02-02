/* istanbul ignore file */

import { Global, Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SYMBOL_REPOSITORY_NAME } from "../domain/repositories/symbol.repository";
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
		CollectSymbolForwardPEJob,
		CollectSymbolROEJob,
		RankSymbolsJob,
		YahooFinanceAPICliente
	],
	controllers: [],
	exports: [SYMBOL_REPOSITORY_NAME, CollectSymbolForwardPEJob, CollectSymbolROEJob, RankSymbolsJob, YahooFinanceAPICliente],
})
export class InfrastructureModule {}
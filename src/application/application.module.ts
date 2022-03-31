/* istanbul ignore file */

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DomainModule } from "../domain/domain.module";
import { SymbolMapper } from "./mappers/symbol.mapper";
import { SymbolController } from "./rest/controllers/symbol.controller";
import { SymbolService } from "./services/symbol.service";

@Module({
	imports: [
		ConfigModule.forRoot(),
		DomainModule,
	],
	controllers: [SymbolController],
	providers: [
		SymbolService,
		SymbolMapper
	]
})
export class ApplicationModule {}
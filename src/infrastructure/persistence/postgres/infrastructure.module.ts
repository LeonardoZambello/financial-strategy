/* istanbul ignore file */

import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SYMBOL_REPOSITORY_NAME } from "src/domain/repositories/symbol.repository";
import TypeOrmConnectionOptions from "./config/config-connection";
import { SymbolRepository } from "./repositories/symbol.repository";
import { SymbolSchema } from "./schema/symbol.schema";

@Global()
@Module({
	imports: [
		TypeOrmModule.forRoot(TypeOrmConnectionOptions),
		TypeOrmModule.forFeature([
			SymbolSchema
		])
	],
	providers: [
		{
			provide: SYMBOL_REPOSITORY_NAME,
			useClass: SymbolRepository
		}
	],
	controllers: [],
	exports: [SYMBOL_REPOSITORY_NAME],
})
export class InfrastructureModule {}
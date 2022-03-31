/* istanbul ignore file */

import { Module } from "@nestjs/common";
import { FindSymbolByNameUseCase } from "./use-cases/find-symbol-by-name";
import { SaveSymbolsUseCase } from "./use-cases/save-symbols";

@Module({
	providers: [
		SaveSymbolsUseCase,
		FindSymbolByNameUseCase
	],
	exports: [
		SaveSymbolsUseCase,
		FindSymbolByNameUseCase
	],
})
export class DomainModule {}

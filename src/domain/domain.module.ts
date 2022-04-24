/* istanbul ignore file */

import { Module } from "@nestjs/common";
import { CollectAndUpdateSymbolsValuesUseCase } from "./use-cases/collect-and-update-symbols-values.use-case";
import { DeleteSymbolUseCase } from "./use-cases/delete-symbol.use-case";
import { FindAllSymbolsUseCase } from "./use-cases/find-all-symbols.use-case";
import { FindSymbolByNameUseCase } from "./use-cases/find-symbol-by-name";
import { SaveSymbolsUseCase } from "./use-cases/save-symbols";

@Module({
	providers: [
		SaveSymbolsUseCase,
		FindSymbolByNameUseCase,
		FindAllSymbolsUseCase,
		DeleteSymbolUseCase,
		CollectAndUpdateSymbolsValuesUseCase
	],
	exports: [
		SaveSymbolsUseCase,
		FindSymbolByNameUseCase,
		FindAllSymbolsUseCase,
		DeleteSymbolUseCase,
		CollectAndUpdateSymbolsValuesUseCase
	],
})
export class DomainModule {}

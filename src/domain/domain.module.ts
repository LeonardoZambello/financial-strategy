/* istanbul ignore file */

import { Module } from "@nestjs/common";
import { SaveSymbolsUseCase } from "./use-cases/save-symbols";

@Module({
	providers: [SaveSymbolsUseCase],
	exports: [SaveSymbolsUseCase],
})
export class DomainModule {}

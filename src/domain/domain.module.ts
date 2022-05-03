/* istanbul ignore file */

import { Module } from "@nestjs/common";
import { CollectAndUpdateStocksValuesUseCase } from "./use-cases/collect-and-update-stocks-values.use-case";
import { DeleteStockUseCase } from "./use-cases/delete-stock.use-case";
import { FindAllStocksUseCase } from "./use-cases/find-all-stocks.use-case";
import { FindStockBySymbolUseCase } from "./use-cases/find-stock-by-symbol";
import { SaveStockUseCase } from "./use-cases/save-stocks";

@Module({
	providers: [
		SaveStockUseCase,
		FindStockBySymbolUseCase,
		FindAllStocksUseCase,
		DeleteStockUseCase,
		CollectAndUpdateStocksValuesUseCase
	],
	exports: [
		SaveStockUseCase,
		FindStockBySymbolUseCase,
		FindAllStocksUseCase,
		DeleteStockUseCase,
		CollectAndUpdateStocksValuesUseCase
	],
})
export class DomainModule {}

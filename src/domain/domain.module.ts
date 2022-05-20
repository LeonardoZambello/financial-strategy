/* istanbul ignore file */

import { Module } from "@nestjs/common";
import { AddStockToBlacklistUseCase } from "./use-cases/add-stock-to-blacklist.use-case";
import { CollectAndUpdateStocksValuesUseCase } from "./use-cases/collect-and-update-stocks-values.use-case";
import { DeleteStockUseCase } from "./use-cases/delete-stock.use-case";
import { FindAllStocksUseCase } from "./use-cases/find-all-stocks.use-case";
import { FindStockBySymbolUseCase } from "./use-cases/find-stock-by-symbol";
import { RemoveStockFromBlacklistUseCase } from "./use-cases/remove-stock-from-blacklist.use-case";
import { SaveStockUseCase } from "./use-cases/save-stocks";

@Module({
	providers: [
		SaveStockUseCase,
		FindStockBySymbolUseCase,
		FindAllStocksUseCase,
		DeleteStockUseCase,
		CollectAndUpdateStocksValuesUseCase,
		AddStockToBlacklistUseCase,
		RemoveStockFromBlacklistUseCase
	],
	exports: [
		SaveStockUseCase,
		FindStockBySymbolUseCase,
		FindAllStocksUseCase,
		DeleteStockUseCase,
		CollectAndUpdateStocksValuesUseCase,
		AddStockToBlacklistUseCase,
		RemoveStockFromBlacklistUseCase
	],
})
export class DomainModule {}

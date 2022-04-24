import { Inject, Injectable } from "@nestjs/common";
import { ISymbolDataCollector, SYMBOL_DATA_COLLECTOR_NAME } from "../collector/symbol-data.collector";
import { Symbol } from "../entities/symbol.entity";
import { ISymbolRepository, SYMBOL_REPOSITORY_NAME } from "../repositories/symbol.repository";

@Injectable()
export class CollectAndUpdateSymbolsValuesUseCase {
    constructor (
        @Inject(SYMBOL_DATA_COLLECTOR_NAME) private symbolDataCollector: ISymbolDataCollector,
        @Inject(SYMBOL_REPOSITORY_NAME) private symbolRepository: ISymbolRepository
    ) {}

    async handle(): Promise<void> {
        const symbols = await this.symbolDataCollector.collectData();

        for (const symbol of symbols) {
            const symbolFromDB = await this.symbolRepository.findByName(symbol.name);
            
            if (!symbolFromDB) {
                await this.symbolRepository.save(symbol);

                continue;
            }

            symbolFromDB.roe = symbol.roe;
            symbolFromDB.forwardPE = symbol.forwardPE;

            await this.symbolRepository.save(symbolFromDB);
        }
    }
}

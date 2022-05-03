/* istanbul ignore file */

import { Logger } from "@nestjs/common";
import axios from "axios";
import { IStockDataCollector } from "../../domain/collector/stock-data.collector";
import { Stock } from "../../domain/entities/stock.entity";
import { ErrorWhileCallingAPI } from "../exceptions/error-while-calling-api.excepetion";

export class MeusDividendosAPIClient implements IStockDataCollector {

    private logger = new Logger(MeusDividendosAPIClient.name);
    private readonly MEUS_DIVIDENDOS_BASE_URL = process.env.MEUS_DIVIDENDOS_BASE_URL;
    private readonly MEUS_DIVIDENDOS_VALOR_MERCADO_ROUTE = process.env.MEUS_DIVIDENDOS_VALOR_MERCADO_ROUTE;
    private readonly MEUS_DIVIDENDOS_LUCRO_LIQUIDO_ROUTE = process.env.MEUS_DIVIDENDOS_LUCRO_LIQUIDO_ROUTE;
    private readonly MEUS_DIVIDENDOS_ROE_ROUTE = process.env.MEUS_DIVIDENDOS_ROE_ROUTE;

    async collectData(): Promise<Stock[]> {
        const empresas = {};

        await this.populaValor(empresas, `${this.MEUS_DIVIDENDOS_BASE_URL}${this.MEUS_DIVIDENDOS_ROE_ROUTE}`, "roe");
        await this.populaValor(empresas, `${this.MEUS_DIVIDENDOS_BASE_URL}${this.MEUS_DIVIDENDOS_VALOR_MERCADO_ROUTE}`, "valorMercado");
        await this.populaValor(empresas, `${this.MEUS_DIVIDENDOS_BASE_URL}${this.MEUS_DIVIDENDOS_LUCRO_LIQUIDO_ROUTE}`, "lucroLiquido");

        const stocks = new Array<Stock>();

        const entries: any = Object.entries(empresas);

        entries.forEach(data => {
            const stock = new Stock();
            stock.symbol = String(data[0]);
            stock.name = String(data[1].nomeEmpresa);
            Number(data[1].roe) === 0 ? stock.roe = null : stock.roe = Number(data[1].roe);
            (Number(data[1].valorMercado) === 0 || Number(data[1].lucroLiquido) === 0) ? stock.forwardPE = null : stock.forwardPE = ((Number(data[1].valorMercado)) / Number(data[1].lucroLiquido));
            stocks.push(stock);
        });

        return stocks;
    }

    private getPrimeiraTabela(html: string): string {
        return html.match("<tbody.*?<\/tbody>")[0];
    }
    private getElementosTabela(tabela: string): any {
        return tabela.match(/<tr.*?<\/tr>/g);
    }
    private getElementosLinha(linha: string): any {
        return linha.match(/<td.*?<\/td>/g);
    }
    private getSiglaEmpresa(elementosLinha: any): string {
        return elementosLinha[2].match("<div.*?>(.*?)<\/div>")[1];
    }
    private getValor(elementosLinha: any): any {
        return elementosLinha[3].match("<td><span.*?>(.*?)<\/span>")[1];
    }
    private getNameEmpresa(elementosLinha: any): any {
        return elementosLinha[1].match("<span.*?>(.*?)<\/span>")[1];
    }
    private async populaValor(empresas: any, url: string, campo: string) {
        try {
            const { data } = await axios.get(url);

            const tabela = this.getPrimeiraTabela(data);

            const empresasTr = this.getElementosTabela(tabela);

            empresasTr.forEach((empresa: string) => {
                const campos = this.getElementosLinha(empresa);
                const sigla = this.getSiglaEmpresa(campos);
                if (!empresas[sigla]) empresas[sigla] = {};
                empresas[sigla][campo] = this.getValor(campos);
                if (campo === 'roe') {
                    const nomeEmpresa = {
                        nomeEmpresa: this.getNameEmpresa(campos)
                    }
                    Object.assign(empresas[sigla], nomeEmpresa);
                }
            });
        } catch (error) {
            this.logger.error(`Error while calling meusdividendos API: ${error}`);

            throw new ErrorWhileCallingAPI('Meusdividendos')
        }
    }
}

import { Logger } from "@nestjs/common";
import axios from "axios";
import { ISymbolDataCollector } from "src/domain/collector/symbol-data.collector";
import { Symbol } from "../../domain/entities/symbol.entity";
import { ErrorWhileCallingAPI } from "../exceptions/error-while-calling-api.excepetion";

export class MeusDividendosAPIClient implements ISymbolDataCollector {

    private logger = new Logger(MeusDividendosAPIClient.name);
    private readonly MEUS_DIVIDENDOS_BASE_URL = process.env.MEUS_DIVIDENDOS_BASE_URL;
    private readonly MEUS_DIVIDENDOS_VALOR_MERCADO_ROUTE = process.env.MEUS_DIVIDENDOS_VALOR_MERCADO_ROUTE;
    private readonly MEUS_DIVIDENDOS_LUCRO_LIQUIDO_ROUTE = process.env.MEUS_DIVIDENDOS_LUCRO_LIQUIDO_ROUTE;
    private readonly MEUS_DIVIDENDOS_ROE_ROUTE = process.env.MEUS_DIVIDENDOS_ROE_ROUTE;

    async collectData(): Promise<Symbol[]> {
        const empresas = {};

        await this.populaValor(empresas, `${this.MEUS_DIVIDENDOS_BASE_URL}${this.MEUS_DIVIDENDOS_ROE_ROUTE}`, "roe");
        await this.populaValor(empresas, `${this.MEUS_DIVIDENDOS_BASE_URL}${this.MEUS_DIVIDENDOS_VALOR_MERCADO_ROUTE}`, "valorMercado");
        await this.populaValor(empresas, `${this.MEUS_DIVIDENDOS_BASE_URL}${this.MEUS_DIVIDENDOS_LUCRO_LIQUIDO_ROUTE}`, "lucroLiquido");

        const symbols = new Array<Symbol>();

        const entries: any = Object.entries(empresas);

        entries.forEach(data => {
            const symbol = new Symbol();
            symbol.name = String(data[0]);
            Number(data[1].roe) === 0 ? symbol.roe = null : symbol.roe = Number(data[1].roe);
            (Number(data[1].valorMercado) === 0 || Number(data[1].lucroLiquido) === 0) ? symbol.forwardPE = null : symbol.forwardPE = ((Number(data[1].valorMercado)) / Number(data[1].lucroLiquido));
            symbols.push(symbol);
        });

        return symbols;
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
            });
        } catch (error) {
            this.logger.error(`Error while calling meusdividendos API: ${error}`);

            throw new ErrorWhileCallingAPI('Meusdividendos')
        }
    }
}

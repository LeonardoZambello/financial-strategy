import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class YahooFinanceAPICliente {

    private logger = new Logger(YahooFinanceAPICliente.name);
    private readonly BASE_URL = process.env.BASE_URL;
    private readonly FORWARDPE_API = process.env.FORWARDPE_API;
    private readonly ROE_API = process.env.ROE_API;
    private readonly API_KEY = process.env.API_KEY;

    async collectForwardPE(name: string): Promise<number> {
        try {
            const { data, status } = await axios.get(
                `${this.BASE_URL}${this.FORWARDPE_API}`,
                {
                    headers: {
                        'x-api-key': this.API_KEY
                    },
                    params: {
                        'symbols': `${name}.SA`
                    },
                    validateStatus: function (status) {
                        if (status !== 200 && status !== 429) return false
                        return true
                    }
                }
            )

            console.log(data);

            if (status === 200) return data.quoteResponse.result[0].forwardPE;

            if (status === 429) return Promise.reject('Error status code: 429');

        } catch (error) {
            this.logger.error(`Error while calling yahoo api: ${error}`);
        }
    }

    async collectROE(name: string): Promise<number> {
        try {
            const { data, status } = await axios.get(
                `${this.BASE_URL}${this.ROE_API}/${name}.SA`,
                {
                    headers: {
                        'x-api-key': this.API_KEY
                    },
                    params: {
                        'modules': 'financialData'
                    },
                    validateStatus: function (status) {
                        if (status !== 200 && status !== 429) return false
                        return true
                    }
                }
            )

            if (status === 200) return data.quoteSummary.result[0].financialData.returnOnEquity.raw;

            if (status === 429) return Promise.reject('Error status code: 429');

        } catch (error) {
            this.logger.error(`Error while calling yahoo api: ${error}`);
        }
    }
}

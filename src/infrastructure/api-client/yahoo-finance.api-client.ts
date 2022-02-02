import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as nock from 'nock';

@Injectable()
export class YahooFinanceAPICliente {

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
                    }
                }
            )
            
            if (status === 200) return data.quoteResponse.result[0].forwardPE;

        } catch (error) {
            console.log(`Error while calling yahoo api: ${error}`);
        }
    }
}

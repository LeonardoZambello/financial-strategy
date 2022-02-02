import * as nock from 'nock';
import { YahooFinanceAPICliente } from "./yahoo-finance.api-client";

describe('YahooFinanceAPICliente', () => {
    it('Should collect symbol forwardPE information with success', async () => {
        process.env.BASE_URL = 'https://yfapi.net';
        process.env.FORWARDPE_API = '/v6/finance/quote';
        process.env.API_KEY = 'RiIY8UDnFb8JWNdphDlJZ4R6M2GET0FDaWqbbnWi';

        const symbol = 'AAAX4'

        const yahooFinanceAPICliente = new YahooFinanceAPICliente();

        nock(process.env.BASE_URL, { allowUnmocked: false })
            .get(`${process.env.FORWARDPE_API}?symbols=${symbol}.SA`)
            .reply(200, {
                quoteResponse: {
                    result: [
                        {
                            forwardPE: 10
                        }
                    ]
                }
            });

        const result = await yahooFinanceAPICliente.collectForwardPE(symbol);

        expect(result).toBe(10);
    });
    it('Should return undefined if yahoo api finance not found symbol', async () => {
        process.env.BASE_URL = 'https://yfapi.net';
        process.env.FORWARDPE_API = '/v6/finance/quote';
        process.env.API_KEY = 'RiIY8UDnFb8JWNdphDlJZ4R6M2GET0FDaWqbbnWi';

        const symbol = 'AAAX4'

        const yahooFinanceAPICliente = new YahooFinanceAPICliente();

        nock(process.env.BASE_URL, { allowUnmocked: false })
            .get(`${process.env.FORWARDPE_API}?symbols=${symbol}.SA`)
            .reply(200, {
                quoteResponse: {
                    result: [],
                    error: null
                }
            });

        const result = await yahooFinanceAPICliente.collectForwardPE(symbol);

        expect(result).toBeUndefined();
    });
});

/* istanbul ignore file */

import { AbstractDomainException } from "./abstract-domain.exception";

export class StocksNotFound extends AbstractDomainException {
    constructor(message: string = 'Stocks not found') {
        super(message);
    }
}

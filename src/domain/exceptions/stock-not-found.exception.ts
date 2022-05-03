/* istanbul ignore file */

import { AbstractDomainException } from "./abstract-domain.exception";

export class StockNotFound extends AbstractDomainException {
    constructor(message: string = 'Stock not found') {
        super(message);
    }
}

/* istanbul ignore file */

import { AbstractDomainException } from "./abstract-domain.exception";

export class StockIsNotBlacklisted extends AbstractDomainException {
    constructor(message: string = 'Stock is not blacklisted') {
        super(message);
    }
}

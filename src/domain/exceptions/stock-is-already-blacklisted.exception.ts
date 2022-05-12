/* istanbul ignore file */

import { AbstractDomainException } from "./abstract-domain.exception";

export class StockAlreadyBlacklisted extends AbstractDomainException {
    constructor(message: string = 'Stock is already blacklisted') {
        super(message);
    }
}

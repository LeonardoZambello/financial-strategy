/* istanbul ignore file */

import { AbstractDomainException } from "./abstract-domain.exception";

export class InvalidStockName extends AbstractDomainException {
    constructor(message: string = 'Invalid stock name') {
        super(message);
    }
}

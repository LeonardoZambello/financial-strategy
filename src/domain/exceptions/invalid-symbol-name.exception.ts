/* istanbul ignore file */

import { AbstractDomainException } from "./abstract-domain.exception";

export class InvalidSymbolName extends AbstractDomainException {
    constructor(message: string = 'Invalid symbol name') {
        super(message);
    }
}

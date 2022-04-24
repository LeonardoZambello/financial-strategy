/* istanbul ignore file */

import { AbstractDomainException } from "./abstract-domain.exception";

export class SymbolNotFound extends AbstractDomainException {
    constructor(message: string = 'Symbol not found') {
        super(message);
    }
}

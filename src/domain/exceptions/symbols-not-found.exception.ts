/* istanbul ignore file */

import { AbstractDomainException } from "./abstract-domain.exception";

export class SymbolsNotFound extends AbstractDomainException {
    constructor(message: string = 'Symbols not found') {
        super(message);
    }
}

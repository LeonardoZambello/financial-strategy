/* istanbul ignore file */

export class AbstractDomainException extends Error {
    constructor(message: string) {
        super(message);
    }
}

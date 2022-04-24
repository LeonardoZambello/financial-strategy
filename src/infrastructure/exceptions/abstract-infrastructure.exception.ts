/* istanbul ignore file */

export class AbstractInfrastructureException extends Error {
    constructor(message: string) {
        super(message);
    }
}

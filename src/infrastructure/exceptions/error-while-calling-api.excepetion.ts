/* istanbul ignore file */

import { AbstractInfrastructureException } from "./abstract-infrastructure.exception";

export class ErrorWhileCallingAPI extends AbstractInfrastructureException {
    constructor(apiName: string) {
        super(`Error while calling ${apiName} api`);
    }
}

/* istanbul ignore file */

import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import { AbstractInfrastructureException } from "../exceptions/abstract-infrastructure.exception";

@Catch(AbstractInfrastructureException)
export class InfrastructureExceptionFilter implements ExceptionFilter {
  catch(exception: AbstractInfrastructureException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message;

    response
      .status(500)
      .json({
        statusCode: 500,
        message: [message],
        error: 'Internal Server Error'
      });
  }
}

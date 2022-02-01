/* istanbul ignore file */

import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { AbstractDomainException } from "../../domain/exceptions/abstract-domain.exception";
import { Response } from "express";

@Catch(AbstractDomainException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: AbstractDomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message;

    response
      .status(400)
      .json({
        statusCode: 400,
        message: [message],
        error: 'Bad Request'
      });
  }
}

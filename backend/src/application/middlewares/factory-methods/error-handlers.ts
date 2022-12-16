/* eslint-disable max-classes-per-file */
import {
  ApplicationError,
  DatabaseError,
  ServiceUnavailableError,
  TokenExpiredError,
  TokenSubjectDoesNotMatchError,
  UserDoNotExistsError,
} from '../../errors';
import { HttpResponse } from '../../contracts/http';
import {
  forbidden,
  serverError,
  serviceUnavailableError,
  unauthorized,
  unknown,
} from '../utils';

// It uses the factory-method design pattern
interface ErrorHandlerProduct {
  operation: (error: Error) => HttpResponse;
}

// It uses the factory-method design pattern
class ApplicationErrorHandlerProduct implements ErrorHandlerProduct {
  public operation(error: ApplicationError): HttpResponse {
    if (error instanceof ServiceUnavailableError) {
      return serviceUnavailableError(error);
    }
    if (error instanceof DatabaseError) {
      return serverError(error);
    }
    if (
      error instanceof UserDoNotExistsError ||
      error instanceof TokenExpiredError
    ) {
      return unauthorized(error);
    }
    if (error instanceof TokenSubjectDoesNotMatchError) {
      return forbidden(error);
    }
    return unknown(error);
  }
}

// It uses the factory-method design pattern
abstract class ErrorHandlerCreator {
  protected abstract factoryMethod(): ErrorHandlerProduct;

  public handle(error: Error): HttpResponse {
    const missingParams = this.factoryMethod();
    return missingParams.operation(error);
  }
}

// It uses the factory-method design pattern
export class ApplicationErrorHandler extends ErrorHandlerCreator {
  protected factoryMethod(): ErrorHandlerProduct {
    return new ApplicationErrorHandlerProduct();
  }
}

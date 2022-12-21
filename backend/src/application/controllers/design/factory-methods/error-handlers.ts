/* eslint-disable max-classes-per-file */
import {
  ApplicationError,
  ActionNotRegisteredError,
  DatabaseError,
  PasswordDoesNotMatchError,
  ServiceUnavailableError,
  UserAlreadyExistsError,
  UserDoNotExistsError,
  MissingBodyParamsError,
  MissingHeaderParamsError,
  MissingUrlParamsError,
} from '../../../errors';
import { HttpResponse } from '../../../contracts/http';
import {
  badRequest,
  forbidden,
  serverError,
  serviceUnavailableError,
  unauthorized,
  unknown,
} from '../../utils';

import {
  DomainError,
  InvalidDocumentNumberError,
  InvalidEmailError,
  InvalidIdError,
  InvalidLastnameError,
  InvalidNameError,
  InvalidPasswordError,
  InvalidPhoneError,
} from '../../../../domain/errors';

// It uses the factory-method design pattern
interface ErrorHandlerProduct {
  operation: (error: Error) => HttpResponse;
}

// It uses the factory-method design pattern
class DomainErrorHandlerProduct implements ErrorHandlerProduct {
  public operation(error: DomainError): HttpResponse {
    if (
      error instanceof InvalidDocumentNumberError ||
      error instanceof InvalidEmailError ||
      error instanceof InvalidIdError ||
      error instanceof InvalidLastnameError ||
      error instanceof InvalidNameError ||
      error instanceof InvalidPasswordError ||
      error instanceof InvalidPhoneError
    ) {
      return badRequest(error);
    }
    return unknown(error);
  }
}

// It uses the factory-method design pattern
class ApplicationErrorHandlerProduct implements ErrorHandlerProduct {
  public operation(error: ApplicationError): HttpResponse {
    if (error instanceof ServiceUnavailableError) {
      return serviceUnavailableError(error);
    }
    if (
      error instanceof DatabaseError ||
      error instanceof ActionNotRegisteredError
    ) {
      return serverError(error);
    }
    if (error instanceof UserDoNotExistsError) {
      return unauthorized(error);
    }
    if (
      error instanceof UserAlreadyExistsError ||
      error instanceof PasswordDoesNotMatchError
    ) {
      return forbidden(error);
    }
    if (
      error instanceof MissingBodyParamsError ||
      error instanceof MissingHeaderParamsError ||
      error instanceof MissingUrlParamsError
    ) {
      return badRequest(error);
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
export class DomainErrorHandler extends ErrorHandlerCreator {
  protected factoryMethod(): ErrorHandlerProduct {
    return new DomainErrorHandlerProduct();
  }
}

// It uses the factory-method design pattern
export class ApplicationErrorHandler extends ErrorHandlerCreator {
  protected factoryMethod(): ErrorHandlerProduct {
    return new ApplicationErrorHandlerProduct();
  }
}

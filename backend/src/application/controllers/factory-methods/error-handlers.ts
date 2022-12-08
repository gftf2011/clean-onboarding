/* eslint-disable max-classes-per-file */
import {
  ApplicationError,
  CommandNotRegisteredError,
  DatabaseError,
  PasswordDoesNotMatchError,
  QueryNotRegisteredError,
  ServiceUnavailableError,
  UserAlreadyExistsError,
  UserDoNotExistsError,
  UserDataCompromisedError,
} from '../../errors';
import { HttpResponse } from '../../contracts/http';
import {
  badRequest,
  dataCompromisedError,
  forbidden,
  serverError,
  serviceUnavailableError,
  unauthorized,
  unknown,
} from '../utils';

import {
  DomainError,
  InvalidDocumentNumberError,
  InvalidEmailError,
  InvalidIdError,
  InvalidLastnameError,
  InvalidNameError,
  InvalidPasswordError,
  InvalidPhoneError,
} from '../../../domain/errors';

interface ErrorHandlerProduct {
  operation: (error: Error) => HttpResponse;
}

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

class ApplicationErrorHandlerProduct implements ErrorHandlerProduct {
  public operation(error: ApplicationError): HttpResponse {
    if (error instanceof ServiceUnavailableError) {
      return serviceUnavailableError(error);
    }
    if (error instanceof UserDataCompromisedError) {
      return dataCompromisedError(error);
    }
    if (
      error instanceof DatabaseError ||
      error instanceof CommandNotRegisteredError ||
      error instanceof QueryNotRegisteredError
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
    return unknown(error);
  }
}

abstract class ErrorHandlerCreator {
  protected abstract factoryMethod(): ErrorHandlerProduct;

  public handle(error: Error): HttpResponse {
    const missingParams = this.factoryMethod();
    return missingParams.operation(error);
  }
}

export class DomainErrorHandler extends ErrorHandlerCreator {
  protected factoryMethod(): ErrorHandlerProduct {
    return new DomainErrorHandlerProduct();
  }
}

export class ApplicationErrorHandler extends ErrorHandlerCreator {
  protected factoryMethod(): ErrorHandlerProduct {
    return new ApplicationErrorHandlerProduct();
  }
}

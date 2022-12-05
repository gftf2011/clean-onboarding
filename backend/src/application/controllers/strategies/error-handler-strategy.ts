/* eslint-disable max-classes-per-file */
import { DomainError } from '../../../domain/errors';

import { ApplicationError } from '../../errors';
import { HttpResponse } from '../../contracts/http';
import {
  ApplicationErrorHandler,
  DomainErrorHandler,
} from '../factory-methods';

interface ErrorHandlerStrategy {
  handle: (error: Error) => HttpResponse;
}

class DomainErrorHandlerStrategy implements ErrorHandlerStrategy {
  public handle(error: DomainError): HttpResponse {
    return new DomainErrorHandler().handle(error);
  }
}

class ApplicationErrorHandlerStrategy implements ErrorHandlerStrategy {
  public handle(error: ApplicationError): HttpResponse {
    return new ApplicationErrorHandler().handle(error);
  }
}

class ErrorHandlerContext {
  private strategy: ErrorHandlerStrategy;

  public setStrategy(strategy: ErrorHandlerStrategy): void {
    this.strategy = strategy;
  }

  public handle(error: Error): HttpResponse {
    return this.strategy.handle(error);
  }
}

export class ErrorHandlerInvoker {
  private context: ErrorHandlerContext;

  constructor() {
    this.context = new ErrorHandlerContext();
  }

  private selectStrategy(error: Error): void {
    if (error instanceof DomainError) {
      this.context.setStrategy(new DomainErrorHandlerStrategy());
    } else {
      this.context.setStrategy(new ApplicationErrorHandlerStrategy());
    }
  }

  public handle(error: Error): HttpResponse {
    this.selectStrategy(error);
    return this.context.handle(error);
  }
}

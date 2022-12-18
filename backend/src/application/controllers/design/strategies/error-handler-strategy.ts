/* eslint-disable max-classes-per-file */
import { DomainError } from '../../../../domain/errors';

import { ApplicationError } from '../../../errors';
import { HttpResponse } from '../../../contracts/http';
import {
  ApplicationErrorHandler,
  DomainErrorHandler,
} from '../factory-methods';

// It uses the strategy design pattern
interface ErrorHandlerStrategy {
  handle: (error: Error) => HttpResponse;
}

// It uses the strategy design pattern
class DomainErrorHandlerStrategy implements ErrorHandlerStrategy {
  public handle(error: DomainError): HttpResponse {
    return new DomainErrorHandler().handle(error);
  }
}

// It uses the strategy design pattern
class ApplicationErrorHandlerStrategy implements ErrorHandlerStrategy {
  public handle(error: ApplicationError): HttpResponse {
    return new ApplicationErrorHandler().handle(error);
  }
}

// It uses the strategy design pattern
class ErrorHandlerContext {
  private strategy: ErrorHandlerStrategy;

  public setStrategy(strategy: ErrorHandlerStrategy): void {
    this.strategy = strategy;
  }

  public handle(error: Error): HttpResponse {
    return this.strategy.handle(error);
  }
}

// It uses the strategy design pattern
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

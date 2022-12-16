/* eslint-disable max-classes-per-file */
import { ApplicationError } from '../../errors';
import { HttpResponse } from '../../contracts/http';
import { ApplicationErrorHandler } from '../factory-methods';

// It uses the strategy design pattern
interface ErrorHandlerStrategy {
  handle: (error: Error) => HttpResponse;
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

  private selectStrategy(_error: Error): void {
    this.context.setStrategy(new ApplicationErrorHandlerStrategy());
  }

  public handle(error: Error): HttpResponse {
    this.selectStrategy(error);
    return this.context.handle(error);
  }
}

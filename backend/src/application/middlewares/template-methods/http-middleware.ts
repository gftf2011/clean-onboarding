import { HttpMissingHeaderParams } from '../factory-methods';
import { ErrorHandlerInvoker } from '../strategies';

import { HttpRequest, HttpResponse } from '../../contracts/http';
import { Middleware } from '../../contracts/middlewares';
import { MissingHeaderParamsError } from '../../errors';

export abstract class HttpMiddleware implements Middleware {
  public requiredHeaderParams: string[] = [];

  private static handleError(error: Error): HttpResponse {
    return new ErrorHandlerInvoker().handle(error);
  }

  constructor() {}

  public async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const missingHeaderParams = HttpMiddleware.getMissingHeaderParams(
        request,
        this.requiredHeaderParams,
      );

      if (missingHeaderParams.length !== 0) {
        throw new MissingHeaderParamsError(missingHeaderParams);
      }
      const response = await this.perform(request);
      return response;
    } catch (error) {
      return HttpMiddleware.handleError(error as Error);
    }
  }

  public abstract perform(request: HttpRequest): Promise<HttpResponse>;

  private static getMissingHeaderParams(
    request: HttpRequest,
    requiredParams: string[],
  ): string[] {
    return new HttpMissingHeaderParams().getParams(request, requiredParams);
  }
}

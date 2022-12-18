import {
  HttpMissingBodyParams,
  HttpMissingHeaderParams,
  HttpMissingUrlParams,
} from '../factory-methods';
import { ErrorHandlerInvoker } from '../strategies';

import { HttpRequest, HttpResponse } from '../../../contracts/http';
import { Controller } from '../../../contracts/controllers';
import {
  MissingBodyParamsError,
  MissingHeaderParamsError,
  MissingUrlParamsError,
} from '../../../errors';

// It uses the template-method design pattern
export abstract class HttpController implements Controller {
  public requiredParams: string[] = [];

  public requiredHeaderParams: string[] = [];

  public requiredUrlParams: string[] = [];

  constructor() {}

  private static handleError(error: Error): HttpResponse {
    return new ErrorHandlerInvoker().handle(error);
  }

  public async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const missingBodyParams = HttpController.getMissingBodyParams(
        request,
        this.requiredParams,
      );
      const missingUrlParams = HttpController.getMissingUrlParams(
        request,
        this.requiredUrlParams,
      );
      const missingHeaderParams = HttpController.getMissingHeaderParams(
        request,
        this.requiredHeaderParams,
      );

      if (missingUrlParams.length !== 0) {
        throw new MissingUrlParamsError(missingUrlParams);
      }
      if (missingBodyParams.length !== 0) {
        throw new MissingBodyParamsError(missingBodyParams);
      }
      if (missingHeaderParams.length !== 0) {
        throw new MissingHeaderParamsError(missingHeaderParams);
      }
      const response = await this.perform(request);
      return response;
    } catch (error) {
      return HttpController.handleError(error as Error);
    }
  }

  public abstract perform(request: HttpRequest): Promise<HttpResponse>;

  private static getMissingBodyParams(
    request: HttpRequest,
    requiredParams: string[],
  ): string[] {
    return new HttpMissingBodyParams().getParams(request, requiredParams);
  }

  private static getMissingUrlParams(
    request: HttpRequest,
    requiredParams: string[],
  ): string[] {
    return new HttpMissingUrlParams().getParams(request, requiredParams);
  }

  private static getMissingHeaderParams(
    request: HttpRequest,
    requiredParams: string[],
  ): string[] {
    return new HttpMissingHeaderParams().getParams(request, requiredParams);
  }
}

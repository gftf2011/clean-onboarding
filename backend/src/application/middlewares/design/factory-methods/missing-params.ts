/* eslint-disable max-classes-per-file */
import { HttpRequest } from '../../../contracts/http';

// It uses the factory-method design pattern
interface HttpMissingParamsProduct {
  operation: (request: HttpRequest, requiredParams: string[]) => string[];
}

// It uses the factory-method design pattern
class HttpMissingHeaderParamsProduct implements HttpMissingParamsProduct {
  public operation(request: HttpRequest, requiredParams: string[]): string[] {
    const missingParams: string[] = [];
    requiredParams.forEach(name => {
      if (!Object.keys(request.headers).includes(name)) {
        missingParams.push(name);
      }
    });
    return missingParams;
  }
}

// It uses the factory-method design pattern
abstract class HttpMissingParamsCreator {
  protected abstract factoryMethod(): HttpMissingParamsProduct;

  public getParams(request: HttpRequest, requiredParams: string[]): string[] {
    const missingParams = this.factoryMethod();
    return missingParams.operation(request, requiredParams);
  }
}

// It uses the factory-method design pattern
export class HttpMissingHeaderParams extends HttpMissingParamsCreator {
  protected factoryMethod(): HttpMissingParamsProduct {
    return new HttpMissingHeaderParamsProduct();
  }
}

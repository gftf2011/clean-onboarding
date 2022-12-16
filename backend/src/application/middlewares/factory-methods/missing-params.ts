/* eslint-disable max-classes-per-file */
import { HttpRequest } from '../../contracts/http';

// It uses the factory-method design pattern
interface HttpMissingParamsProduct {
  operation: (request: HttpRequest, requiredParams: string[]) => string[];
}

// It uses the factory-method design pattern
class HttpMissingBodyParamsProduct implements HttpMissingParamsProduct {
  public operation(request: HttpRequest, requiredParams: string[]): string[] {
    const missingParams: string[] = [];
    requiredParams.forEach(name => {
      if (!Object.keys(request.body).includes(name)) {
        missingParams.push(name);
      }
    });
    return missingParams;
  }
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
class HttpMissingUrlParamsProduct implements HttpMissingParamsProduct {
  public operation(request: HttpRequest, requiredParams: string[]): string[] {
    const missingParams: string[] = [];
    requiredParams.forEach(name => {
      if (!Object.keys(request.urlParams).includes(name)) {
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
export class HttpMissingBodyParams extends HttpMissingParamsCreator {
  protected factoryMethod(): HttpMissingParamsProduct {
    return new HttpMissingBodyParamsProduct();
  }
}

// It uses the factory-method design pattern
export class HttpMissingHeaderParams extends HttpMissingParamsCreator {
  protected factoryMethod(): HttpMissingParamsProduct {
    return new HttpMissingHeaderParamsProduct();
  }
}

// It uses the factory-method design pattern
export class HttpMissingUrlParams extends HttpMissingParamsCreator {
  protected factoryMethod(): HttpMissingParamsProduct {
    return new HttpMissingUrlParamsProduct();
  }
}

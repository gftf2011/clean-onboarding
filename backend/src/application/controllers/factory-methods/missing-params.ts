/* eslint-disable max-classes-per-file */
/**
 * Presentation
 */
import { HttpRequest } from '../../contracts/http';

interface ControllerMissingParamsProduct {
  operation: (request: HttpRequest, requiredParams: string[]) => string[];
}

class ControllerMissingBodyParamsProduct
  implements ControllerMissingParamsProduct
{
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

class ControllerMissingHeaderParamsProduct
  implements ControllerMissingParamsProduct
{
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

class ControllerMissingUrlParamsProduct
  implements ControllerMissingParamsProduct
{
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

abstract class ControllerMissingParamsCreator {
  protected abstract factoryMethod(): ControllerMissingParamsProduct;

  public getParams(request: HttpRequest, requiredParams: string[]): string[] {
    const missingParams = this.factoryMethod();
    return missingParams.operation(request, requiredParams);
  }
}

export class ControllerMissingBodyParams extends ControllerMissingParamsCreator {
  protected factoryMethod(): ControllerMissingParamsProduct {
    return new ControllerMissingBodyParamsProduct();
  }
}

export class ControllerMissingHeaderParams extends ControllerMissingParamsCreator {
  protected factoryMethod(): ControllerMissingParamsProduct {
    return new ControllerMissingHeaderParamsProduct();
  }
}

export class ControllerMissingUrlParams extends ControllerMissingParamsCreator {
  protected factoryMethod(): ControllerMissingParamsProduct {
    return new ControllerMissingUrlParamsProduct();
  }
}

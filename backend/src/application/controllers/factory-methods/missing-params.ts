/* eslint-disable max-classes-per-file */
import { HttpRequest } from '../../contracts/http';

// It uses the factory-method design pattern
interface ControllerMissingParamsProduct {
  operation: (request: HttpRequest, requiredParams: string[]) => string[];
}

// It uses the factory-method design pattern
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

// It uses the factory-method design pattern
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

// It uses the factory-method design pattern
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

// It uses the factory-method design pattern
abstract class ControllerMissingParamsCreator {
  protected abstract factoryMethod(): ControllerMissingParamsProduct;

  public getParams(request: HttpRequest, requiredParams: string[]): string[] {
    const missingParams = this.factoryMethod();
    return missingParams.operation(request, requiredParams);
  }
}

// It uses the factory-method design pattern
export class ControllerMissingBodyParams extends ControllerMissingParamsCreator {
  protected factoryMethod(): ControllerMissingParamsProduct {
    return new ControllerMissingBodyParamsProduct();
  }
}

// It uses the factory-method design pattern
export class ControllerMissingHeaderParams extends ControllerMissingParamsCreator {
  protected factoryMethod(): ControllerMissingParamsProduct {
    return new ControllerMissingHeaderParamsProduct();
  }
}

// It uses the factory-method design pattern
export class ControllerMissingUrlParams extends ControllerMissingParamsCreator {
  protected factoryMethod(): ControllerMissingParamsProduct {
    return new ControllerMissingUrlParamsProduct();
  }
}

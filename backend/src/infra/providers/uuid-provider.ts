/* eslint-disable max-classes-per-file */
import { v4, v5 } from 'uuid';

import { IDProvider, NAMESPACES } from '../../application/contracts/providers';

type IDProviderProduct = IDProvider;

class UUIDProviderProduct implements IDProviderProduct {
  public generateV4(): string {
    return v4();
  }

  public generateV5(name: string, namespace: NAMESPACES): string {
    return v5(name, namespace as string);
  }
}

abstract class IDProviderCreator implements IDProvider {
  protected abstract factoryMethod(): IDProviderProduct;

  public generateV4(): string {
    const idProvider = this.factoryMethod();
    const response = idProvider.generateV4();
    return response;
  }

  public generateV5(name: string, namespace: NAMESPACES): string {
    const idProvider = this.factoryMethod();
    const response = idProvider.generateV5(name, namespace);
    return response;
  }
}

export class UUIDProviderCreator extends IDProviderCreator {
  protected factoryMethod(): IDProviderProduct {
    return new UUIDProviderProduct();
  }
}

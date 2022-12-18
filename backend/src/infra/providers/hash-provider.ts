/* eslint-disable max-classes-per-file */
import crypto from 'crypto';
import { promisify } from 'util';

import { HashProvider } from '../../application/contracts/providers';

type HashProviderProduct = HashProvider;

class HashSha512ProviderProduct implements HashProviderProduct {
  async encode(value: string, salt: string): Promise<string> {
    const buffer = await promisify(crypto.pbkdf2)(
      value,
      salt,
      50000,
      512,
      'sha512',
    );
    return buffer.toString('base64');
  }
}

abstract class HashProviderCreator implements HashProvider {
  protected abstract factoryMethod(): HashProviderProduct;

  public async encode(value: string, salt: string): Promise<string> {
    const hashProvider = this.factoryMethod();
    const response = await hashProvider.encode(value, salt);
    return response;
  }
}

export class HashSha512ProviderCreator extends HashProviderCreator {
  protected factoryMethod(): HashProviderProduct {
    return new HashSha512ProviderProduct();
  }
}

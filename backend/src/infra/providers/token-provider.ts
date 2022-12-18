/* eslint-disable max-classes-per-file */
import jwt from 'jsonwebtoken';

import {
  TokenProvider,
  TokenPayload,
} from '../../application/contracts/providers';

type TokenProviderProduct = TokenProvider;

class JWTTokenProviderProduct implements TokenProviderProduct {
  constructor(private readonly expiresIn: string | number) {}

  public sign(data: TokenPayload): string {
    return jwt.sign(data.payload, data.secret, {
      expiresIn: this.expiresIn,
      subject: data.subject,
    });
  }

  public verify(token: string, secret: string): any {
    return jwt.verify(token, secret);
  }
}

abstract class TokenProviderCreator implements TokenProvider {
  protected abstract factoryMethod(): TokenProviderProduct;

  public sign(data: TokenPayload): string {
    const tokenProvider = this.factoryMethod();
    const response = tokenProvider.sign(data);
    return response;
  }

  public verify(token: string, secret: string): any {
    const tokenProvider = this.factoryMethod();
    const response = tokenProvider.verify(token, secret);
    return response;
  }
}

export class JWTTokenProviderCreator extends TokenProviderCreator {
  constructor(private readonly expiresIn: string | number) {
    super();
  }

  protected factoryMethod(): TokenProviderProduct {
    return new JWTTokenProviderProduct(this.expiresIn);
  }
}

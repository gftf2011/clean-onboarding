/* eslint-disable max-classes-per-file */
import { IValidator } from '../../../contracts/validation';
import { TokenSubjectDoesNotMatchError } from '../../../errors';

type JWTToken = {
  sub: string;
  exp: number;
};

interface TokenValidatorProduct {
  validate: (token: JWTToken) => void;
}

class TokenSubjectValidatorProduct implements TokenValidatorProduct {
  constructor(private readonly subject: string) {}

  public validate(token: JWTToken): void {
    if (this.subject !== token.sub)
      throw new TokenSubjectDoesNotMatchError(this.subject);
  }
}

abstract class TokenValidatorCreator implements IValidator {
  constructor(private readonly token: JWTToken, private readonly data?: any) {}

  protected abstract factoryMethod(data?: any): TokenValidatorProduct;

  public validate(): void {
    const tokenValidator = this.factoryMethod(this.data);
    tokenValidator.validate(this.token);
  }
}

export class TokenSubjectValidatorCreator extends TokenValidatorCreator {
  protected factoryMethod(sub: string): TokenValidatorProduct {
    return new TokenSubjectValidatorProduct(sub);
  }
}

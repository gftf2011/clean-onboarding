import { IUserRepository } from '../../domain/repositories';

import { IValidator } from '../contracts/validation';
import { HttpRequest, HttpResponse } from '../contracts/http';
import { TokenProvider, IDProvider, NAMESPACES } from '../contracts/providers';

import { TokenSubjectValidatorCreator } from './design/factory-methods';
import { TokenValidationComposite } from './design/composite';
import { HttpMiddleware } from './design/template-methods';
import { ok } from './utils';

import { TokenExpiredError, UserDoNotExistsError } from '../errors';

export namespace AuthMiddleware {
  export type Body = any;
  export type Url = any;
  export type Header = { authorization: string };
}

interface ValidationFields {
  sub: string;
}

export class AuthMiddleware extends HttpMiddleware {
  private validator: IValidator;

  public override requiredHeaderParams: string[] = ['authorization'];

  constructor(
    private readonly idProvider: IDProvider,
    private readonly userRepo: IUserRepository,
    private readonly tokenProvider: TokenProvider,
    private readonly secret: string,
  ) {
    super();
  }

  private setupValidators(token: any, fields: ValidationFields): void {
    const { sub } = fields;
    const tokenSubjectValidator = new TokenSubjectValidatorCreator(token, sub);
    const validations = [tokenSubjectValidator];
    this.validator = new TokenValidationComposite(validations);
  }

  private validateToken(): void {
    this.validator.validate();
  }

  private cleanToken(token: string): string {
    return token.split('Bearer ')[1];
  }

  private createSubject(userEmail: string): string {
    return this.idProvider.generateV5(userEmail, NAMESPACES.USER_ACCESS_TOKEN);
  }

  public async perform(
    request: HttpRequest<
      AuthMiddleware.Url,
      AuthMiddleware.Body,
      AuthMiddleware.Header
    >,
  ): Promise<HttpResponse> {
    try {
      const token = this.cleanToken(request.headers.authorization);
      const jwtToken = this.tokenProvider.verify(token, this.secret);
      const user = await this.userRepo.find(jwtToken.id);
      if (!user) throw new UserDoNotExistsError();
      const sub = this.createSubject(user.email);

      this.setupValidators(jwtToken, { sub });
      this.validateToken();
      return ok(jwtToken.id);
    } catch (error) {
      throw new TokenExpiredError();
    }
  }
}

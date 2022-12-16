import { IUserRepository } from '../../domain/repositories';

import { HttpRequest, HttpResponse } from '../contracts/http';
import {
  ITokenProvider,
  IUUIDProvider,
  NAMESPACES,
} from '../contracts/providers';
import { HttpMiddleware } from './template-methods';
import {
  TokenExpiredError,
  TokenSubjectDoesNotMatchError,
  UserDoNotExistsError,
} from '../errors';

import { ok } from './utils';

export namespace AuthMiddleware {
  export type Body = any;
  export type Url = any;
  export type Header = { authorization: string };
}

export class AuthMiddleware extends HttpMiddleware {
  public override requiredHeaderParams: string[] = ['authorization'];

  constructor(
    private readonly uuidProvider: IUUIDProvider,
    private readonly userRepo: IUserRepository,
    private readonly tokenProvider: ITokenProvider,
    private readonly secret: string,
  ) {
    super();
  }

  public async perform(
    request: HttpRequest<
      AuthMiddleware.Url,
      AuthMiddleware.Body,
      AuthMiddleware.Header
    >,
  ): Promise<HttpResponse> {
    const timestamp = Date.now();
    const token = request.headers.authorization.split('Bearer ')[1];
    const accessToken = this.tokenProvider.verify(token, this.secret);
    const user = await this.userRepo.find(accessToken.id);
    const subject = this.uuidProvider.generateV5(
      user.email,
      NAMESPACES.USER_ACCESS_TOKEN,
    );
    const tokenExpirationTimeInMilliseconds = accessToken.exp * 1000;

    if (timestamp > tokenExpirationTimeInMilliseconds)
      throw new TokenExpiredError();
    if (!user) throw new UserDoNotExistsError();
    if (subject !== accessToken.sub)
      throw new TokenSubjectDoesNotMatchError(subject);

    return ok(accessToken.id);
  }
}

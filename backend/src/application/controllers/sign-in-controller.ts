import { AccountDTO } from '../../domain/dtos';

import { HttpRequest, HttpResponse } from '../contracts/http';
import { IUserService } from '../contracts/services';
import { PasswordDoesNotMatchError, UserDoNotExistsError } from '../errors';
import { HttpController } from './design/template-methods';
import { ok } from './utils';

export namespace SignInController {
  export type Body = AccountDTO;
  export type Url = any;
  export type Header = any;
}

export class SignInController extends HttpController {
  public override requiredParams: string[] = ['email', 'password'];

  constructor(
    private readonly userService: IUserService,
    private readonly secret: string,
  ) {
    super();
  }

  public async perform(
    request: HttpRequest<
      SignInController.Url,
      SignInController.Body,
      SignInController.Header
    >,
  ): Promise<HttpResponse> {
    const userExists = await this.userService.findByEmail(request.body.email);

    if (!userExists) throw new UserDoNotExistsError();

    const validPassword = await this.userService.checkPassword(
      request.body,
      userExists.document,
      userExists.password,
    );

    if (!validPassword) throw new PasswordDoesNotMatchError();

    const session = await this.userService.createSession(
      userExists.id,
      userExists.email,
      this.secret,
    );

    return ok({
      auth: `Bearer ${session}`,
    });
  }
}

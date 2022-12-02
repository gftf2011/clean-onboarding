import { HttpRequest, HttpResponse } from '../contracts/http';
import { IUserService } from '../contracts/services';
import { UserDoNotExistsError } from '../errors';
import { HttpController } from './template-methods';
import { ok } from './utils';

export namespace SignInController {
  export type Body = {
    email: string;
    password: string;
  };
  export type Url = any;
  export type Header = any;
}

export class SignInController extends HttpController {
  public override requiredParams: string[] = ['email', 'password'];

  constructor(
    private readonly userServices: IUserService,
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
    const userExists = await this.userServices.findByEmail(request.body.email);

    if (!userExists) throw new UserDoNotExistsError();

    const validPassword = this.userServices.checkPassword(
      userExists.email,
      userExists.document,
      userExists.password,
      request.body.password,
    );

    if (!validPassword) throw new Error('password does not match');

    const session = await this.userServices.createSession(
      userExists.id,
      userExists.email,
      this.secret,
    );

    return ok({
      auth: `Bearer ${session}`,
    });
  }
}

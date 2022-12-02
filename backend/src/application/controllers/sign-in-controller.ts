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

    // TODO: validate user password

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

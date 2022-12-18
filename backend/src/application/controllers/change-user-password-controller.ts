import { UserDTO } from '../../domain/dtos';

import { HttpRequest, HttpResponse } from '../contracts/http';
import { IUserService } from '../contracts/services';
import { UserDoNotExistsError } from '../errors';
import { HttpController } from './design/template-methods';
import { noContent } from './utils';

export namespace ChangeUserPasswordController {
  export type Body = { id: string; password: string };
  export type Url = any;
  export type Header = any;
}

export class ChangeUserPasswordController extends HttpController {
  public override requiredParams: string[] = ['id', 'password'];

  constructor(private readonly userService: IUserService) {
    super();
  }

  public async perform(
    request: HttpRequest<
      ChangeUserPasswordController.Url,
      ChangeUserPasswordController.Body,
      ChangeUserPasswordController.Header
    >,
  ): Promise<HttpResponse> {
    const userExists = await this.userService.find(request.body.id);
    if (!userExists) throw new UserDoNotExistsError();
    const user: UserDTO = {
      ...userExists,
      password: request.body.password,
    };
    await this.userService.changeUserPassword(userExists.id, user);
    return noContent();
  }
}

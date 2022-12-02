import { UserDTO } from '../../domain/dtos';

import { HttpRequest, HttpResponse } from '../contracts/http';
import { IUserService } from '../contracts/services';
import { UserAlreadyExistsError } from '../errors';
import { HttpController } from './template-methods';
import { noContent } from './utils';

export namespace SignUpController {
  export type Body = UserDTO;
}

export class SignUpController extends HttpController {
  public override requiredParams: string[] = [
    'email',
    'password',
    'name',
    'lastname',
    'phone',
    'document',
    'locale',
  ];

  constructor(private readonly userServices: IUserService) {
    super();
  }

  public async perform(
    request: HttpRequest<any, UserDTO, any>,
  ): Promise<HttpResponse> {
    const userExists = await this.userServices.findByEmail(request.body.email);
    if (userExists) throw new UserAlreadyExistsError();
    await this.userServices.save(request.body);
    return noContent();
  }
}

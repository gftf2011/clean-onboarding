import { Nationalities } from '../../../domain/contracts';
import { UserDTO } from '../../../domain/dtos';
import { UserModel } from '../../../domain/models';

import { IUserService } from '../interfaces';
import { ICommandBus, IQueryBus } from '../../bus';
import { CreateUserCommand } from '../../commands';
import { CreateUserSessionQuery, FindUserQuery } from '../../queries';

export class UserService implements IUserService {
  constructor(
    private readonly commandBus: ICommandBus,
    private readonly queryBus: IQueryBus,
  ) {}

  public async createSession(
    userId: string,
    userEmail: string,
    secret: string,
  ): Promise<string> {
    const response = await this.queryBus.execute(
      new CreateUserSessionQuery({
        id: userId,
        secret,
        email: userEmail,
      }),
    );

    return response;
  }

  public async find(id: string): Promise<UserModel> {
    const response = await this.queryBus.execute(
      new FindUserQuery({
        id,
      }),
    );

    return response as UserModel;
  }

  public async save(input: UserDTO): Promise<void> {
    await this.commandBus.execute(
      new CreateUserCommand({
        locale: input.locale as Nationalities,
        user: {
          document: input.document,
          email: input.email,
          lastname: input.lastname,
          name: input.name,
          password: input.password,
          phone: input.phone,
        },
      }),
    );
  }
}

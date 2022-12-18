import { Nationalities } from '../../domain/contracts';
import { AccountDTO, UserDTO } from '../../domain/dtos';
import { UserModel } from '../../domain/models';

import { IUserService } from '../contracts/services';
import { CommandBus, QueryBus } from '../contracts/bus';
import {
  CreateUserAction,
  ChangeUserPasswordAction,
  CheckUserPasswordAction,
  GetUserSessionAction,
  FindUserByEmailAction,
  FindUserAction,
} from '../actions';

export class UserService implements IUserService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  public async findByEmail(email: string): Promise<UserModel> {
    const response = await this.queryBus.execute(
      new FindUserByEmailAction({
        email,
      }),
    );

    return response as UserModel;
  }

  public async find(id: string): Promise<UserModel> {
    const response = await this.queryBus.execute(
      new FindUserAction({
        id,
      }),
    );

    return response as UserModel;
  }

  public async save(input: UserDTO): Promise<void> {
    await this.commandBus.execute(
      new CreateUserAction({
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

  public async changeUserPassword(id: string, user: UserDTO): Promise<void> {
    await this.commandBus.execute(
      new ChangeUserPasswordAction({
        user: {
          id,
          document: user.document,
          email: user.email,
          lastname: user.lastname,
          name: user.name,
          password: user.password,
          phone: user.phone,
        },
        locale: user.locale as Nationalities,
      }),
    );
  }

  public async createSession(
    userId: string,
    userEmail: string,
    secret: string,
  ): Promise<string> {
    const response = await this.queryBus.execute(
      new GetUserSessionAction({
        id: userId,
        secret,
        email: userEmail,
      }),
    );

    return response;
  }

  public async checkPassword(
    account: AccountDTO,
    document: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const response = await this.queryBus.execute(
      new CheckUserPasswordAction({
        account,
        document,
        hashedPassword,
      }),
    );

    return response;
  }
}

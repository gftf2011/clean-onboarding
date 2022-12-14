import { AccountDTO } from '../../domain/dtos';

import { IAccountService } from '../contracts/services';
import { IQueryBus } from '../contracts/bus';
import { CheckUserPasswordQuery, CreateUserSessionQuery } from '../queries';

export class AccountService implements IAccountService {
  constructor(private readonly queryBus: IQueryBus) {}

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

  public async checkPassword(
    account: AccountDTO,
    document: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const response = await this.queryBus.execute(
      new CheckUserPasswordQuery({
        account,
        document,
        hashedPassword,
      }),
    );

    return response;
  }
}

import { CheckUserPasswordQuery } from '../../queries';
import { IQueryHandler } from '../../contracts/handlers';
import { IHashProvider } from '../../contracts/providers';

export class CheckUserPasswordQueryHandler implements IQueryHandler<boolean> {
  readonly operation: string = 'check-user-password';

  constructor(private readonly hash: IHashProvider) {}

  public async handle(action: CheckUserPasswordQuery): Promise<boolean> {
    const salt = `${action.data.account.email}$${action.data.document}`;
    const hashedPassword = await this.hash.encode(
      action.data.account.password,
      salt,
    );
    return hashedPassword === action.data.hashedPassword;
  }
}

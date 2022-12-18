import { CheckUserPasswordAction } from '../actions';
import { Handler } from '../contracts/handlers';
import { IHashProvider } from '../contracts/providers';

export class CheckUserPasswordHandler implements Handler<boolean> {
  readonly operation: string = 'check-user-password';

  constructor(private readonly hash: IHashProvider) {}

  private createEncryptionSalt(
    userEmail: string,
    userDocument: string,
  ): string {
    return `${userEmail}$${userDocument}`;
  }

  public async handle(action: CheckUserPasswordAction): Promise<boolean> {
    const { hashedPassword, document, account } = action.data;
    const { email, password } = account;
    const salt = this.createEncryptionSalt(email, document);
    const encodedPassword = await this.hash.encode(password, salt);
    return hashedPassword === encodedPassword;
  }
}

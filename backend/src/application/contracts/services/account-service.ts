import { AccountDTO } from '../../../domain/dtos';

export interface IAccountService {
  createSession: (
    userId: string,
    userEmail: string,
    secret: string,
  ) => Promise<string>;
  checkPassword: (
    account: AccountDTO,
    document: string,
    hashedPassword: string,
  ) => Promise<boolean>;
}

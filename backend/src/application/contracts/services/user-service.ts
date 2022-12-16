import { UserModel } from '../../../domain/models';
import { AccountDTO, UserDTO } from '../../../domain/dtos';

export interface IUserService {
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
  changeUserPassword: (id: string, user: UserDTO) => Promise<void>;
  find: (id: string) => Promise<UserModel>;
  findByEmail: (email: string) => Promise<UserModel>;
  save: (input: UserDTO) => Promise<void>;
}

import { UserModel } from '../../../domain/models';
import { UserDTO } from '../../../domain/dtos';

export interface IUserService {
  checkPassword: (
    email: string,
    document: string,
    hashedPassword: string,
    password: string,
  ) => Promise<boolean>;
  createSession: (
    userId: string,
    userEmail: string,
    secret: string,
  ) => Promise<string>;
  find: (id: string) => Promise<UserModel>;
  findByEmail: (email: string) => Promise<UserModel>;
  save: (input: UserDTO) => Promise<void>;
}

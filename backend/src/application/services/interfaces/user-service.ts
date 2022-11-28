import { UserModel } from '../../../domain/models';
import { UserDTO } from '../../../domain/dtos';

export interface IUserService {
  createSession: (userId: string, secret: string) => Promise<string>;
  find: (id: string) => Promise<UserModel>;
  save: (input: UserDTO) => Promise<void>;
}

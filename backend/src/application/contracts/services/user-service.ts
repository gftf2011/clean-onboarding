import { UserModel } from '../../../domain/models';
import { UserDTO } from '../../../domain/dtos';

export interface IUserService {
  find: (id: string) => Promise<UserModel>;
  findByEmail: (email: string) => Promise<UserModel>;
  save: (input: UserDTO) => Promise<void>;
}

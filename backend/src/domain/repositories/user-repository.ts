import { Repository } from './repository';
import { UserModel } from '../models';

export interface IUserRepository extends Repository<UserModel> {
  findByEmail(email: string): Promise<UserModel>;
}

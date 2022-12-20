import { Repository } from './repository';
import { UserModel } from '../models';

export interface UserRepository extends Repository<UserModel> {
  findByEmail(email: string): Promise<UserModel>;
}

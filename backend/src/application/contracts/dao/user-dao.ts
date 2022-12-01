import { Dao } from './base';
import { UserModel } from '../../../domain/models';

export interface IUserDao extends Dao<UserModel> {
  findByEmail(email: string): Promise<UserModel>;
}

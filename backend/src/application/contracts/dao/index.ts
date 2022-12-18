import { UserModel } from '../../../domain/models';

export interface Dao<T> {
  save(value: T): Promise<void>;
  update(value: T): Promise<void>;
  delete(id: string): Promise<void>;
  find(id: string): Promise<T>;
  findAll(page: number, limit: number): Promise<T[]>;
}

export interface IUserDao extends Dao<UserModel> {
  findByEmail(email: string): Promise<UserModel>;
}

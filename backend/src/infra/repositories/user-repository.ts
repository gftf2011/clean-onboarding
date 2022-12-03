import { IUserDao } from '../../application/contracts/dao';

import { IUserRepository } from '../../domain/repositories';
import { UserModel } from '../../domain/models';

export class UserRepository implements IUserRepository {
  constructor(
    private readonly dependencies: {
      user: IUserDao;
    },
  ) {}

  async find(id: string): Promise<UserModel> {
    return this.dependencies.user.find(id);
  }

  async findByEmail(email: string): Promise<UserModel> {
    return this.dependencies.user.findByEmail(email);
  }

  async findAll(page: number, limit: number): Promise<UserModel[]> {
    return this.dependencies.user.findAll(page, limit);
  }

  async save(user: UserModel): Promise<void> {
    await this.dependencies.user.save(user);
  }

  async update(user: UserModel): Promise<void> {
    await this.dependencies.user.update(user);
  }

  async delete(id: string): Promise<void> {
    await this.dependencies.user.delete(id);
  }
}

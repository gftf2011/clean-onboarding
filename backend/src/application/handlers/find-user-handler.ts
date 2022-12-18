import { UserModel } from '../../domain/models';
import { IUserRepository } from '../../domain/repositories';

import { FindUserAction } from '../actions';
import { Handler } from '../contracts/handlers';

export class FindUserHandler implements Handler<UserModel> {
  readonly operation: string = 'find-user';

  constructor(private readonly userRepo: IUserRepository) {}

  public async handle(action: FindUserAction): Promise<UserModel> {
    const user = await this.userRepo.find(action.data.id);
    return user;
  }
}

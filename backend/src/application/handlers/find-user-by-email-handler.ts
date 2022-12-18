import { UserModel } from '../../domain/models';
import { IUserRepository } from '../../domain/repositories';

import { FindUserByEmailAction } from '../actions';
import { Handler } from '../contracts/handlers';

export class FindUserByEmailHandler implements Handler<UserModel> {
  readonly operation: string = 'find-user-by-email';

  constructor(private readonly userRepo: IUserRepository) {}

  public async handle(action: FindUserByEmailAction): Promise<UserModel> {
    const user = await this.userRepo.findByEmail(action.data.email);
    return user;
  }
}

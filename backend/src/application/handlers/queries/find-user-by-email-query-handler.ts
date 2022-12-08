import { UserModel } from '../../../domain/models';
import { IUserRepository } from '../../../domain/repositories';

import { FindUserByEmailQuery } from '../../queries';
import { IQueryHandler } from '../../contracts/handlers';

export class FindUserByEmailQueryHandler implements IQueryHandler<UserModel> {
  readonly operation: string = 'find-user-by-email';

  constructor(private readonly userRepo: IUserRepository) {}

  public async handle(action: FindUserByEmailQuery): Promise<UserModel> {
    const user = await this.userRepo.findByEmail(action.data.email);

    return user;
  }
}

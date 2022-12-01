import { UserModel } from '../../../domain/models';
import { IUserRepository } from '../../../domain/repositories';

import { FindUserQuery } from '../../queries';
import { IQueryHandler } from '../../contracts/handlers';

export class FindUserQueryHandler implements IQueryHandler<UserModel> {
  readonly operation: string = 'find-user';

  constructor(private readonly userRepo: IUserRepository) {}

  public async handle(action: FindUserQuery): Promise<UserModel> {
    const user = await this.userRepo.find(action.data.id);

    return user;
  }
}

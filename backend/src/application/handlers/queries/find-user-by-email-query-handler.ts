import { User } from '../../../domain/entities';
import { UserModel } from '../../../domain/models';
import { Nationalities } from '../../../domain/contracts';
import { IUserRepository } from '../../../domain/repositories';

import { FindUserByEmailQuery } from '../../queries';
import { IQueryHandler } from '../../contracts/handlers';

export class FindUserByEmailQueryHandler implements IQueryHandler<UserModel> {
  readonly operation: string = 'find-user-by-email';

  constructor(private readonly userRepo: IUserRepository) {}

  public async handle(action: FindUserByEmailQuery): Promise<UserModel> {
    const user = await this.userRepo.findByEmail(action.data.email);

    if (user) {
      const userOrError = User.create(
        user.id,
        {
          document: user.document,
          lastname: user.lastname,
          email: user.email,
          name: user.name,
          password: user.password,
          phone: user.phone,
        },
        {
          encrypted: true,
          nationality: user.locale as Nationalities,
        },
      );

      if (userOrError.isLeft()) {
        // TODO: create more semantic error
        throw new Error('inconsistent data');
      }
    }

    return user;
  }
}

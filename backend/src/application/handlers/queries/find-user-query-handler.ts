import { User } from '../../../domain/entities';
import { UserModel } from '../../../domain/models';
import { Nationalities } from '../../../domain/contracts';
import { IUserRepository } from '../../../domain/repositories';

import { FindUserQuery } from '../../queries';
import { IQueryHandler } from '../../contracts/handlers';

export class FindUserQueryHandler implements IQueryHandler<UserModel> {
  readonly operation: string = 'find-user';

  constructor(private readonly userRepo: IUserRepository) {}

  public async handle(action: FindUserQuery): Promise<UserModel> {
    const user = await this.userRepo.find(action.data.id);

    /**
     * Extra validation added to verify if user data was modified in the database
     */
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
        throw userOrError.value;
      }
    }

    return user;
  }
}

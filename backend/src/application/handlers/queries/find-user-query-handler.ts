import { Nationalities } from '../../../domain/contracts';
import { User } from '../../../domain/entities';
import { UserModel } from '../../../domain/models';
import { IUserRepository } from '../../../domain/repositories';

import { FindUserQuery } from '../../queries';
import { IQueryHandler } from '../interfaces';

export class FindUserQueryHandler implements IQueryHandler<UserModel> {
  readonly operation: string = 'find-user';

  constructor(private readonly userRepo: IUserRepository) {}

  public async handle(action: FindUserQuery): Promise<UserModel> {
    const user = await this.userRepo.find(action.data.id);

    if (!user) {
      throw new Error('No User found');
    }

    const userOrError = User.create(
      user.id,
      {
        document: user.document,
        email: user.email,
        lastname: user.lastname,
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

    const validUser: UserModel = {
      id: user.id,
      email: userOrError.value.get().email.get(),
      name: userOrError.value.get().name.get(),
      lastname: userOrError.value.get().lastname.get(),
      document: userOrError.value.get().document.get(),
      phone: userOrError.value.get().phone.get(),
      password: userOrError.value.get().password.get(),
      locale: user.locale,
    };

    return validUser;
  }
}

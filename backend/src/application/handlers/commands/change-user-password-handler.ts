import { User } from '../../../domain/entities';
import { UserModel } from '../../../domain/models';
import { IUserRepository } from '../../../domain/repositories';

import { ICommandHandler } from '../../contracts/handlers';
import { ChangeUserPasswordCommand } from '../../commands';
import { IHashProvider } from '../../contracts/providers';

export class ChangeUserPasswordHandler implements ICommandHandler {
  readonly operation: string = 'change-user-password';

  constructor(
    private readonly hash: IHashProvider,
    private readonly userRepo: IUserRepository,
  ) {}

  async handle(command: ChangeUserPasswordCommand): Promise<void> {
    const userOrError = User.create(
      command.data.user.id,
      {
        document: command.data.user.document,
        lastname: command.data.user.lastname,
        email: command.data.user.email,
        name: command.data.user.name,
        password: command.data.user.password,
        phone: command.data.user.phone,
      },
      {
        encrypted: false,
        nationality: command.data.locale,
      },
    );

    if (userOrError.isLeft()) {
      throw userOrError.value;
    }

    const hashedPassword = await this.hash.encode(
      userOrError.value.get().password.get(),
      `${userOrError.value.get().email.get()}$${userOrError.value
        .get()
        .document.get()}`,
    );

    const user: UserModel = {
      ...command.data.user,
      password: hashedPassword,
      locale: command.data.locale,
    };

    await this.userRepo.update(user);
  }
}

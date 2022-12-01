import { User } from '../../../domain/entities';
import { UserModel } from '../../../domain/models';
import { IUserRepository } from '../../../domain/repositories';

import { CreateUserCommand } from '../../commands';
import { ICommandHandler } from '../../contracts/handlers';
import { IUUIDProvider, IHashProvider } from '../../contracts/providers';

export class CreateUserCommandHandler implements ICommandHandler {
  readonly operation: string = 'create-user';

  constructor(
    private readonly uuid: IUUIDProvider,
    private readonly hash: IHashProvider,
    private readonly userRepo: IUserRepository,
  ) {}

  public async handle(command: CreateUserCommand): Promise<void> {
    const id = this.uuid.generateV4();

    const userOrError = User.create(
      id,
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
      userOrError.value.get().document.get(),
      `${userOrError.value.get().email.get()}$${userOrError.value
        .get()
        .document.get()}`,
    );

    const user: UserModel = {
      id,
      email: userOrError.value.get().email.get(),
      name: userOrError.value.get().name.get(),
      lastname: userOrError.value.get().lastname.get(),
      document: userOrError.value.get().document.get(),
      phone: userOrError.value.get().phone.get(),
      password: hashedPassword,
      locale: command.data.locale.toString(),
    };

    await this.userRepo.save(user);
  }
}

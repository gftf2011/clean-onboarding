import { Nationalities } from '../../domain/contracts';
import { UserDTO } from '../../domain/dtos';
import { User } from '../../domain/entities';
import { UserModel } from '../../domain/models';
import { UserRepository } from '../../domain/repositories';

import { CreateUserAction, SendWelcomeEmailAction } from '../actions';

import { Handler } from '../contracts/handlers';
import { ActionPublisher } from '../contracts/actions';
import { IDProvider, HashProvider } from '../contracts/providers';

export class CreateUserHandler implements Handler<void> {
  readonly operation: string = 'create-user';

  constructor(
    private readonly idProvider: IDProvider,
    private readonly hashProvider: HashProvider,
    private readonly userRepo: UserRepository,
    private readonly publisher: ActionPublisher,
  ) {}

  private validateAndCreateUser(input: UserDTO): UserDTO {
    const { document, email, lastname, locale, name, password, phone, id } =
      input;
    const userOrError = User.create(
      id,
      {
        document,
        lastname,
        email,
        name,
        password,
        phone,
      },
      {
        encrypted: false,
        nationality: locale as Nationalities,
      },
    );

    if (userOrError.isLeft()) {
      throw userOrError.value;
    }

    return userOrError.value.get();
  }

  private createId(): string {
    return this.idProvider.generateV4();
  }

  private createEncryptionSalt(
    userEmail: string,
    userDocument: string,
  ): string {
    return `${userEmail}$${userDocument}`;
  }

  public async handle(action: CreateUserAction): Promise<void> {
    const validatedUser = this.validateAndCreateUser({
      ...action.data.user,
      id: this.createId(),
      locale: action.data.locale,
    });
    const salt = this.createEncryptionSalt(
      validatedUser.email,
      validatedUser.document,
    );
    const hashedPassword = await this.hashProvider.encode(
      validatedUser.password,
      salt,
    );
    const user: UserModel = {
      ...validatedUser,
      id: validatedUser?.id,
      password: hashedPassword,
    };

    await this.userRepo.save(user);

    await this.publisher.publish(
      new SendWelcomeEmailAction({
        fullName: `${user.name} ${user.lastname}`,
        to: user.email,
      }),
    );
  }
}

import { Nationalities } from '../../domain/contracts';
import { UserDTO } from '../../domain/dtos';
import { User } from '../../domain/entities';
import { UserModel } from '../../domain/models';
import { IUserRepository } from '../../domain/repositories';

import { Handler } from '../contracts/handlers';
import { ChangeUserPasswordAction } from '../actions';
import { HashProvider } from '../contracts/providers';

export class ChangeUserPasswordHandler implements Handler<void> {
  readonly operation: string = 'change-user-password';

  constructor(
    private readonly hash: HashProvider,
    private readonly userRepo: IUserRepository,
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

  private createEncryptionSalt(
    userEmail: string,
    userDocument: string,
  ): string {
    return `${userEmail}$${userDocument}`;
  }

  async handle(action: ChangeUserPasswordAction): Promise<void> {
    const validatedUser = this.validateAndCreateUser({
      ...action.data.user,
      locale: action.data.locale,
    });
    const salt = this.createEncryptionSalt(
      validatedUser.email,
      validatedUser.document,
    );
    const hashedPassword = await this.hash.encode(validatedUser.password, salt);

    const user: UserModel = {
      ...validatedUser,
      id: validatedUser?.id,
      password: hashedPassword,
    };

    await this.userRepo.update(user);
  }
}

import { Either, left, right } from '../../../shared';

import { InvalidPasswordError } from '../../errors';
import { PasswordValidationCreator } from '../../contracts';
import {
  DecryptedPasswordValidationCreator,
  EncryptedPasswordValidationCreator,
} from './helpers';

export class Password {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public get(): string {
    return this.value;
  }

  private static selectValidation(
    encrypted: boolean,
  ): PasswordValidationCreator {
    if (encrypted) {
      return new EncryptedPasswordValidationCreator();
    }
    return new DecryptedPasswordValidationCreator();
  }

  public static create(
    password: string,
    encrypted: boolean,
  ): Either<Error, Password> {
    const validationType = Password.selectValidation(encrypted);

    if (!password || !validationType.validate(password)) {
      return left(new InvalidPasswordError());
    }

    return right(new Password(password));
  }
}

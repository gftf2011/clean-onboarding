/* eslint-disable max-classes-per-file */
import {
  PasswordValidation,
  PasswordValidationCreator,
} from '../../../contracts';

export class EncryptedPasswordValidation implements PasswordValidation {
  public validate(password: string): boolean {
    if (password.length <= 24) {
      return false;
    }

    return true;
  }
}

export class EncryptedPasswordValidationCreator extends PasswordValidationCreator {
  protected factoryMethod(): PasswordValidation {
    return new EncryptedPasswordValidation();
  }
}

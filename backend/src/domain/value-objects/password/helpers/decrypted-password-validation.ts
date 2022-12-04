/* eslint-disable max-classes-per-file */
import {
  PasswordValidation,
  PasswordValidationCreator,
} from '../../../contracts';

export class DecryptedPasswordValidation implements PasswordValidation {
  private static countOnlyNumbers(password: string): number {
    return password.replace(/(\D)/g, '').length;
  }

  private static countOnlyUpperCaseLetters(password: string): number {
    return password.replace(/([^A-Z]*)/g, '').length;
  }

  private static countOnlyLowerCaseLetters(password: string): number {
    return password.replace(/([^a-z]*)/g, '').length;
  }

  private static countOnlySpecialCharacters(password: string): number {
    return password.replace(/([\^!@#$%&?]*)/g, '').length;
  }

  private static hasEmptySpace(password: string): boolean {
    const PASSWORD_HAS_ANY_SPACE_REGEX = /(\s+)/g;

    return PASSWORD_HAS_ANY_SPACE_REGEX.test(password);
  }

  public validate(password: string): boolean {
    if (
      password.length < 11 ||
      password.length > 24 ||
      DecryptedPasswordValidation.hasEmptySpace(password) ||
      DecryptedPasswordValidation.countOnlyNumbers(password) < 8 ||
      DecryptedPasswordValidation.countOnlyUpperCaseLetters(password) < 1 ||
      DecryptedPasswordValidation.countOnlyLowerCaseLetters(password) < 1 ||
      DecryptedPasswordValidation.countOnlySpecialCharacters(password) < 1
    ) {
      return false;
    }

    return true;
  }
}

export class DecryptedPasswordValidationCreator extends PasswordValidationCreator {
  protected factoryMethod(): PasswordValidation {
    return new DecryptedPasswordValidation();
  }
}

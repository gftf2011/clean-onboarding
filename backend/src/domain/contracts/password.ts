/* eslint-disable max-classes-per-file */
export interface PasswordValidation {
  validate: (password: string) => boolean;
}

export abstract class PasswordValidationCreator implements PasswordValidation {
  protected abstract factoryMethod(): PasswordValidation;

  public validate(password: string): boolean {
    const product = this.factoryMethod();
    return product.validate(password);
  }
}

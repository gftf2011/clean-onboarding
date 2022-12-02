import { ApplicationError } from './application-error';

export class PasswordDoesNotMatchError extends ApplicationError {
  constructor() {
    super();
    this.message = `password provided does not match with user saved password`;
    this.name = PasswordDoesNotMatchError.name;
  }
}

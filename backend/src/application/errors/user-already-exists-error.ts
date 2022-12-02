import { ApplicationError } from './application-error';

export class UserAlreadyExistsError extends ApplicationError {
  constructor() {
    super();
    this.message = `user already exists`;
    this.name = UserAlreadyExistsError.name;
  }
}

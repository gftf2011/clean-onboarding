import { ApplicationError } from './application-error';

export class UserDoNotExistsError extends ApplicationError {
  constructor() {
    super();
    this.message = `user do not exists`;
    this.name = UserDoNotExistsError.name;
  }
}

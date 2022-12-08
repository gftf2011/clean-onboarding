import { ApplicationError } from './application-error';

export class UserDataCompromisedError extends ApplicationError {
  constructor() {
    super();
    this.message = `user data was compromised`;
    this.name = UserDataCompromisedError.name;
  }
}

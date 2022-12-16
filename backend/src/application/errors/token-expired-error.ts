import { ApplicationError } from './application-error';

export class TokenExpiredError extends ApplicationError {
  constructor() {
    super();
    this.message = `token expired, please create another token`;
    this.name = TokenExpiredError.name;
  }
}

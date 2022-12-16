import { ApplicationError } from './application-error';

export class TokenSubjectDoesNotMatchError extends ApplicationError {
  constructor(sub: string | number) {
    super();
    this.message = `token subject "${sub}" does not match`;
    this.name = TokenSubjectDoesNotMatchError.name;
  }
}

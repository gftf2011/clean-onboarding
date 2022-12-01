import { DomainError } from './domain-error';

export class InvalidPasswordError extends DomainError {
  constructor() {
    super();
    this.message = `password is not strong enough OR is not defined`;
    this.name = InvalidPasswordError.name;
  }
}

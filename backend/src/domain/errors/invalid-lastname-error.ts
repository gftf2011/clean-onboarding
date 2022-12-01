import { DomainError } from './domain-error';

export class InvalidLastnameError extends DomainError {
  constructor(value: string) {
    super();
    this.message = `lastname "${value || ''}" is not valid`;
    this.name = InvalidLastnameError.name;
  }
}

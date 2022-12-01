import { DomainError } from './domain-error';

export class InvalidIdError extends DomainError {
  constructor(value: string) {
    super();
    this.message = `id "${value || ''}" is not valid`;
    this.name = InvalidIdError.name;
  }
}

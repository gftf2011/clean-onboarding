import { DomainError } from './domain-error';

export class InvalidPhoneError extends DomainError {
  constructor(value: string, locale: string) {
    super();
    this.message = `phone number "${
      value || ''
    }" is not valid for - ${locale} - locale`;
    this.name = InvalidPhoneError.name;
  }
}

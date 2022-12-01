import { DomainError } from './domain-error';

export class InvalidDocumentNumberError extends DomainError {
  constructor(value: string, locale: string) {
    super();
    this.message = `document number "${
      value || ''
    }" is not valid for - ${locale} - locale`;
    this.name = InvalidDocumentNumberError.name;
  }
}

export class InvalidDocumentNumberError extends Error {
  constructor(value: string, locale: string) {
    super();
    this.message = `document number "${
      value || ''
    }" is not valid for - ${locale} - locale`;
    this.name = InvalidDocumentNumberError.name;
  }
}

export class InvalidEmailError extends Error {
  constructor(value: string) {
    super();
    this.message = `email "${value || ''}" is not valid`;
    this.name = InvalidEmailError.name;
  }
}

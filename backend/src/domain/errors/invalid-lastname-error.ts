export class InvalidLastnameError extends Error {
  constructor(value: string) {
    super();
    this.message = `lastname "${value || ''}" is not valid`;
    this.name = InvalidLastnameError.name;
  }
}

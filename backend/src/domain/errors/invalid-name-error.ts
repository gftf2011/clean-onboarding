export class InvalidNameError extends Error {
  constructor(value: string) {
    super();
    this.message = `name "${value || ''}" is not valid`;
    this.name = InvalidNameError.name;
  }
}

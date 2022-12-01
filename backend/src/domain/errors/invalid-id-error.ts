export class InvalidIdError extends Error {
  constructor(value: string) {
    super();
    this.message = `id "${value || ''}" is not valid`;
    this.name = InvalidIdError.name;
  }
}

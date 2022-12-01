export class InvalidPasswordError extends Error {
  constructor() {
    super();
    this.message = `password is not strong enough OR is not defined`;
    this.name = InvalidPasswordError.name;
  }
}

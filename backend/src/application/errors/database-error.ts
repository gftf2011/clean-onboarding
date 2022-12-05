import { ApplicationError } from './application-error';

export class DatabaseError extends ApplicationError {
  constructor() {
    super();
    this.message = `database internal error`;
    this.name = DatabaseError.name;
  }
}

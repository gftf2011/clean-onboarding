import { ApplicationError } from './application-error';

export class DatabaseError extends ApplicationError {
  constructor() {
    super();
    this.message = `databasebase internal error`;
    this.name = DatabaseError.name;
  }
}

import { IQuery } from '../contracts/queries';
import { ApplicationError } from './application-error';

export class QueryNotRegisteredError extends ApplicationError {
  constructor(action: IQuery) {
    super();
    this.message = `query action "${action.operation}" not registered`;
    this.name = QueryNotRegisteredError.name;
  }
}

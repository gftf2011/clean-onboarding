import { IQuery } from '../contracts/queries';

export class QueryNotRegisteredError extends Error {
  constructor(action: IQuery) {
    super();
    this.message = `query action "${action.operation}" not registered`;
    this.name = QueryNotRegisteredError.name;
  }
}

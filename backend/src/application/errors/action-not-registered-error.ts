import { Action } from '../contracts/actions';
import { ApplicationError } from './application-error';

export class ActionNotRegisteredError extends ApplicationError {
  constructor(action: Action) {
    super();
    this.message = `action "${action.operation}" not registered`;
    this.name = ActionNotRegisteredError.name;
  }
}

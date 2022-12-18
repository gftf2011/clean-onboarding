import { Action } from '../contracts/actions';

export namespace FindUserByEmailAction {
  export type Data = {
    email: string;
  };
}

// It uses the command design pattern
export class FindUserByEmailAction implements Action {
  readonly operation: string = 'find-user-by-email';

  constructor(public readonly data: FindUserByEmailAction.Data) {}
}

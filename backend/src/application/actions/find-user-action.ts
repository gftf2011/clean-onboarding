import { Action } from '../contracts/actions';

export namespace FindUserAction {
  export type Data = {
    id: string;
  };
}

// It uses the command design pattern
export class FindUserAction implements Action {
  readonly operation: string = 'find-user';

  constructor(public readonly data: FindUserAction.Data) {}
}

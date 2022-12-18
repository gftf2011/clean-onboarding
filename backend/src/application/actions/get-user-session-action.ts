import { Action } from '../contracts/actions';

export namespace GetUserSessionAction {
  export type Data = {
    id: string;
    email: string;
    secret: string;
  };
}

// It uses the command design pattern
export class GetUserSessionAction implements Action {
  readonly operation: string = 'get-create-session';

  constructor(public readonly data: GetUserSessionAction.Data) {}
}

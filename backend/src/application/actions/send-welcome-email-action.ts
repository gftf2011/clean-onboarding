import { Action } from '../contracts/actions';

export namespace SendWelcomeEmailAction {
  export type Data = {
    to: string;
    fullName: string;
  };
}

// It uses the command design pattern
export class SendWelcomeEmailAction implements Action {
  readonly operation: string = 'send-welcome-email';

  constructor(public readonly data: SendWelcomeEmailAction.Data) {}
}

import { AccountDTO } from '../../domain/dtos';

import { Action } from '../contracts/actions';

export namespace CheckUserPasswordAction {
  export type Data = {
    account: AccountDTO;
    document: string;
    hashedPassword: string;
  };
}

// It uses the command design pattern
export class CheckUserPasswordAction implements Action {
  readonly operation: string = 'check-user-password';

  constructor(public readonly data: CheckUserPasswordAction.Data) {}
}

import { AccountDTO } from '../../domain/dtos';

import { IQuery } from '../contracts/queries';

export namespace CheckUserPasswordQuery {
  export type Data = {
    account: AccountDTO;
    document: string;
    hashedPassword: string;
  };
}

// It uses the command design pattern
export class CheckUserPasswordQuery implements IQuery {
  readonly operation: string = 'check-user-password';

  constructor(public readonly data: CheckUserPasswordQuery.Data) {}
}

import { IQuery } from '../contracts/queries';

export namespace CheckUserPasswordQuery {
  export type Data = {
    email: string;
    document: string;
    hashedPassword: string;
    password: string;
  };
}

export class CheckUserPasswordQuery implements IQuery {
  readonly operation: string = 'check-user-password';

  constructor(public readonly data: CheckUserPasswordQuery.Data) {}
}

import { IQuery } from '../contracts/queries';

export namespace FindUserByEmailQuery {
  export type Data = {
    email: string;
  };
}

// It uses the command design pattern
export class FindUserByEmailQuery implements IQuery {
  readonly operation: string = 'find-user-by-email';

  constructor(public readonly data: FindUserByEmailQuery.Data) {}
}

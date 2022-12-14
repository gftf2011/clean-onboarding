import { IQuery } from '../contracts/queries';

export namespace FindUserQuery {
  export type Data = {
    id: string;
  };
}

// It uses the command design pattern
export class FindUserQuery implements IQuery {
  readonly operation: string = 'find-user';

  constructor(public readonly data: FindUserQuery.Data) {}
}

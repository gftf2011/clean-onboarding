import { IQuery } from './query';

export namespace FindUserQuery {
  export type Data = {
    id: string;
  };
}

export class FindUserQuery implements IQuery {
  readonly operation: string = 'find-user';

  constructor(public readonly data: FindUserQuery.Data) {}
}

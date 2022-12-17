import { IQuery } from '../contracts/queries';

export namespace GetUserSessionQuery {
  export type Data = {
    id: string;
    email: string;
    secret: string;
  };
}

// It uses the command design pattern
export class GetUserSessionQuery implements IQuery {
  readonly operation: string = 'create-session';

  constructor(public readonly data: GetUserSessionQuery.Data) {}
}

import { IQuery } from '../contracts/queries';

export namespace CreateUserSessionQuery {
  export type Data = {
    id: string;
    email: string;
    secret: string;
  };
}

export class CreateUserSessionQuery implements IQuery {
  readonly operation: string = 'create-session';

  constructor(public readonly data: CreateUserSessionQuery.Data) {}
}

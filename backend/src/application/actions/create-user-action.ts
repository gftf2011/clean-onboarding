import { Nationalities } from '../../domain/contracts';

import { Action } from '../contracts/actions';

export namespace CreateUserAction {
  export type Data = {
    user: {
      email: string;
      name: string;
      lastname: string;
      document: string;
      phone: string;
      password: string;
    };
    locale: Nationalities;
  };
}

// It uses the command design pattern
export class CreateUserAction implements Action {
  readonly operation: string = 'create-user';

  constructor(public readonly data: CreateUserAction.Data) {}
}

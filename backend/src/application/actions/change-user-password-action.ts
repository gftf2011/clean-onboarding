import { Nationalities } from '../../domain/contracts';

import { Action } from '../contracts/actions';

export namespace ChangeUserPasswordAction {
  export type Data = {
    user: {
      id: string;
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
export class ChangeUserPasswordAction implements Action {
  readonly operation: string = 'change-user-password';

  constructor(public readonly data: ChangeUserPasswordAction.Data) {}
}

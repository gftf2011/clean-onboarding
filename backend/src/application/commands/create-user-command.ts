import { Nationalities } from '../../domain/contracts';

import { ICommand } from './command';

export namespace CreateUserCommand {
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

export class CreateUserCommand implements ICommand {
  readonly operation: string = 'create-user';

  constructor(public readonly data: CreateUserCommand.Data) {}
}

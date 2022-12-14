import { Nationalities } from '../../domain/contracts';

import { ICommand } from '../contracts/commands';

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

// It uses the command design pattern
export class CreateUserCommand implements ICommand {
  readonly operation: string = 'create-user';

  constructor(public readonly data: CreateUserCommand.Data) {}
}

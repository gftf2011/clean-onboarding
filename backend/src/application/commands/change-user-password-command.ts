import { Nationalities } from '../../domain/contracts';

import { ICommand } from '../contracts/commands';

export namespace ChangeUserPasswordCommand {
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
export class ChangeUserPasswordCommand implements ICommand {
  readonly operation: string = 'change-user-password';

  constructor(public readonly data: ChangeUserPasswordCommand.Data) {}
}

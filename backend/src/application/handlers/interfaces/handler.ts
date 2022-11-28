import { IQuery } from '../../queries';
import { ICommand } from '../../commands';

export interface IHandler {
  readonly operation: string;
  handle: (input: any) => Promise<any>;
}

export interface ICommandHandler extends IHandler {
  readonly operation: string;
  handle: (command: ICommand) => Promise<void>;
}

export interface IQueryHandler<T = any> extends IHandler {
  readonly operation: string;
  handle: (action: IQuery) => Promise<T>;
}

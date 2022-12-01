import { ICommand } from '../commands';
import { IQuery } from '../queries';

export interface IBus {
  execute: (data: any) => Promise<any>;
}

export interface ICommandBus extends IBus {
  execute: (command: ICommand) => Promise<void>;
}

export interface IQueryBus extends IBus {
  execute: (data: IQuery) => Promise<any>;
}

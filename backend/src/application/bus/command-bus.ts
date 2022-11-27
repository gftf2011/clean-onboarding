import { ICommand } from '../commands';
import { IBus } from './bus';

export interface ICommandBus extends IBus {
  execute: (command: ICommand) => Promise<void>;
}

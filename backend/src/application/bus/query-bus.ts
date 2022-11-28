import { IQuery } from '../queries';
import { IBus } from './bus';

export interface IQueryBus extends IBus {
  execute: (data: IQuery) => Promise<any>;
}

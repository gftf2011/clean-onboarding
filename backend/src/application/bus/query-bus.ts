import { IBus } from './bus';

export interface IQueryBus extends IBus {
  execute: (data: any) => Promise<any>;
}

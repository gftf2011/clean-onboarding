import { Action } from '../actions';

export interface QueryBus<T = any> {
  execute: (action: Action) => Promise<T>;
}

export interface CommandBus {
  execute: (action: Action) => Promise<void>;
}

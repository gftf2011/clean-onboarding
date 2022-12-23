import { Action } from '../../../../../src/application/contracts/actions';
import { CommandBus } from '../../../../../src/application/contracts/bus';

export class CommandBusDummy implements CommandBus {
  execute: (action: Action) => Promise<void>;
}

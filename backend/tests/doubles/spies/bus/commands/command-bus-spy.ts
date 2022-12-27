import { Action } from '../../../../../src/application/contracts/actions';
import { CommandBus } from '../../../../../src/application/contracts/bus';

export class CommandBusSpy implements CommandBus {
  public actions: Action[] = [];

  public async execute(action: Action): Promise<void> {
    this.actions.push(action);
  }
}

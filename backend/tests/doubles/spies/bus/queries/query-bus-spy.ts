import { Action } from '../../../../../src/application/contracts/actions';
import { QueryBus } from '../../../../../src/application/contracts/bus';

export class QueryBusSpy implements QueryBus {
  public actions: Action[] = [];

  public async execute(action: Action): Promise<any> {
    this.actions.push(action);
    return {};
  }
}

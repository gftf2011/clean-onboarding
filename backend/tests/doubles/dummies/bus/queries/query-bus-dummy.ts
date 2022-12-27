import { Action } from '../../../../../src/application/contracts/actions';
import { QueryBus } from '../../../../../src/application/contracts/bus';

export class QueryBusDummy implements QueryBus {
  execute: (action: Action) => Promise<any>;
}

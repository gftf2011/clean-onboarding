import { Action } from '../../../../../src/application/contracts/actions';
import { QueryBus } from '../../../../../src/application/contracts/bus';

export class QueryBusStub implements QueryBus {
  constructor(private readonly data: any) {}

  public async execute(_action: Action): Promise<any> {
    return this.data;
  }
}

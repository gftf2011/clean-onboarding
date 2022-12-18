/* eslint-disable @typescript-eslint/ban-types */
import { IQueue } from '../../../../application/contracts/queue';
import { ActionSubscriber } from '../../../../application/contracts/actions';
import { Handler } from '../../../../application/contracts/handlers';

export class RabbitmqActionSubscriber extends ActionSubscriber {
  constructor(queue: IQueue, handler: Handler) {
    super(queue, handler);
  }
}

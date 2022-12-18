/* eslint-disable @typescript-eslint/ban-types */
import { Queue } from '../../../../application/contracts/queue';
import { ActionSubscriber } from '../../../../application/contracts/actions';
import { Handler } from '../../../../application/contracts/handlers';

export class RabbitmqActionSubscriber extends ActionSubscriber {
  constructor(queue: Queue, handler: Handler) {
    super(queue, handler);
  }
}

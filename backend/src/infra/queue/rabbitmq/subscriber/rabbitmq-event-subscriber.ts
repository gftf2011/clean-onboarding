/* eslint-disable @typescript-eslint/ban-types */
import { IQueue } from '../../../../application/contracts/queue';
import { EventSubscriber } from '../../../../application/contracts/events';
import { IEventHandler } from '../../../../application/contracts/handlers';

export class RabbitmqEventSubscriber extends EventSubscriber {
  constructor(queue: IQueue, eventHandler: IEventHandler) {
    super(queue, eventHandler);
  }
}

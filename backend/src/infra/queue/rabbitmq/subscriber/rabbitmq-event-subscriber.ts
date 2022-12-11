/* eslint-disable @typescript-eslint/ban-types */
import { IQueue } from '../../../../application/contracts/queue';
import { IEventSubscriber } from '../../../../application/contracts/events';
import { IEventHandler } from '../../../../application/contracts/handlers';

export class RabbitmqEventSubscriber implements IEventSubscriber {
  constructor(private readonly queue: IQueue) {}

  public async subscribe(handler: IEventHandler): Promise<void> {
    await this.queue.createChannel();
    await this.queue.consume(handler.operation, handler.handle);
    await this.queue.closeChannel();
  }
}

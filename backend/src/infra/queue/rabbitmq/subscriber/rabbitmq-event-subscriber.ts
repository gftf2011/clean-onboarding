/* eslint-disable @typescript-eslint/ban-types */
import { IQueue } from '../../../../application/contracts/queue';
import { IEventSubscriber } from '../../../../application/contracts/events';

export class RabbitmqEventSubscriber implements IEventSubscriber {
  constructor(private readonly queue: IQueue) {}

  public async subscribe(event: string, callback: Function): Promise<void> {
    await this.queue.consume(event, callback);
  }
}

import { IQueue } from '../../../../application/contracts/queue';
import {
  IEvent,
  IEventPublisher,
} from '../../../../application/contracts/events';

export class RabbitmqEventPublisher implements IEventPublisher {
  constructor(private readonly queue: IQueue) {}

  public async publish(event: IEvent): Promise<void> {
    try {
      await this.queue.createChannel();
      await this.queue.publish(event.operation, event);
      await this.queue.closeChannel();
    } catch (error) {
      await this.queue.closeChannel();
    }
  }
}

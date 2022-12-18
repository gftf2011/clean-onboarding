import { IQueue } from '../../../../application/contracts/queue';
import {
  Action,
  ActionPublisher,
} from '../../../../application/contracts/actions';

export class RabbitmqActionPublisher implements ActionPublisher {
  constructor(private readonly queue: IQueue) {}

  public async publish(action: Action): Promise<void> {
    try {
      await this.queue.createChannel();
      await this.queue.publish(action.operation, action);
      await this.queue.closeChannel();
    } catch (error) {
      await this.queue.closeChannel();
    }
  }
}

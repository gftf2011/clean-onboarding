import { Queue } from '../../../../application/contracts/queue';
import {
  Action,
  ActionPublisher,
} from '../../../../application/contracts/actions';

export class RabbitmqActionPublisherDecorator implements ActionPublisher {
  constructor(private readonly queue: Queue) {}

  public async publish(action: Action): Promise<void> {
    await this.queue.publish(action.operation, action);
  }
}

import { Queue } from '../../../../../../application/contracts/queue';
import {
  Action,
  ActionPublisher,
} from '../../../../../../application/contracts/actions';

export class ActionPublisherTransaction implements ActionPublisher {
  constructor(
    private readonly queue: Queue,
    private readonly decoratee: ActionPublisher,
  ) {}

  public async publish(action: Action): Promise<void> {
    try {
      await this.queue.createChannel();
      await this.decoratee.publish(action);
      await this.queue.closeChannel();
    } catch (error) {
      await this.queue.closeChannel();
    }
  }
}

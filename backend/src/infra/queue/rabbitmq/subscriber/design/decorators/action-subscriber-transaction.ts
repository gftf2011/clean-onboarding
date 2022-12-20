import { Queue } from '../../../../../../application/contracts/queue';
import { ActionSubscriber } from '../../../../../../application/contracts/actions';
import { Handler } from '../../../../../../application/contracts/handlers';

export class ActionSubscriberTransactionDecorator implements ActionSubscriber {
  constructor(
    private readonly queue: Queue,
    private readonly decoratee: ActionSubscriber,
  ) {}

  public async subscribe(handler: Handler): Promise<void> {
    try {
      await this.queue.createChannel();
      await this.decoratee.subscribe(handler);
    } catch (error) {
      await this.queue.closeChannel();
    }
  }
}

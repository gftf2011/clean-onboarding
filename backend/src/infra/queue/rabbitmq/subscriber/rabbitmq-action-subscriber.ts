/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/ban-types */
import { Queue } from '../../../../application/contracts/queue';
import { ActionSubscriber } from '../../../../application/contracts/actions';
import { Handler } from '../../../../application/contracts/handlers';

export class RabbitmqActionSubscriber implements ActionSubscriber {
  constructor(private readonly queue: Queue) {}

  async subscribe(handler: Handler): Promise<void> {
    await this.queue.consume(handler.operation, async (data: any) => {
      await handler.handle(data);
    });
  }
}

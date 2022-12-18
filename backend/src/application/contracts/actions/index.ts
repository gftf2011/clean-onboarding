import { Handler } from '../handlers';
import { Queue } from '../queue';

export interface Action {
  readonly operation: string;
  readonly data: any;
}

export interface ActionPublisher {
  publish: (action: Action) => Promise<void>;
}

export class ActionSubscriber {
  constructor(
    private readonly queue: Queue,
    private readonly handler: Handler,
  ) {
    this.subscribe(this.queue, this.handler);
  }

  private async subscribe(queue: Queue, handler: Handler): Promise<void> {
    try {
      await queue.createChannel();
      await queue.consume(handler.operation, async (data: any) => {
        await handler.handle(data);
      });
    } catch (error) {
      await queue.closeChannel();
    }
  }
}

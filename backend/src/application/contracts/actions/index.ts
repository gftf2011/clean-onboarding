import { Handler } from '../handlers';
import { IQueue } from '../queue';

export interface Action {
  readonly operation: string;
  readonly data: any;
}

export interface ActionPublisher {
  publish: (action: Action) => Promise<void>;
}

export class ActionSubscriber {
  constructor(
    private readonly queue: IQueue,
    private readonly handler: Handler,
  ) {
    this.subscribe(this.queue, this.handler);
  }

  private async subscribe(queue: IQueue, handler: Handler): Promise<void> {
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

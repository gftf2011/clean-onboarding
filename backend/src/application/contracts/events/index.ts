import { IEventHandler } from '../handlers';
import { IQueue } from '../queue';

/* eslint-disable @typescript-eslint/ban-types */
export interface IEvent {
  readonly operation: string;
  readonly data: any;
}

export interface IEventPublisher {
  publish: (event: IEvent) => Promise<void>;
}

export class EventSubscriber {
  constructor(
    private readonly queue: IQueue,
    private readonly eventHandler: IEventHandler,
  ) {
    this.subscribe(this.queue, this.eventHandler);
  }

  private async subscribe(
    queue: IQueue,
    eventHandler: IEventHandler,
  ): Promise<void> {
    try {
      await queue.createChannel();
      await queue.consume(eventHandler.operation, async (data: any) => {
        await eventHandler.handle(data);
      });
    } catch (error) {
      await queue.closeChannel();
    }
  }
}

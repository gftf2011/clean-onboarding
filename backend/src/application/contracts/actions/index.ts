import { Handler } from '../handlers';

export interface Action {
  readonly operation: string;
  readonly data: any;
}

export interface ActionPublisher {
  publish: (action: Action) => Promise<void>;
}

export interface ActionSubscriber {
  subscribe: (handler: Handler) => Promise<void>;
}

export class ActionSubscriberInitializer {
  constructor(
    private readonly subscriber: ActionSubscriber,
    private readonly handler: Handler,
  ) {
    this.subscriber.subscribe(this.handler);
  }
}

/* eslint-disable @typescript-eslint/ban-types */
export interface IEvent {
  readonly operation: string;
  readonly data: any;
}

export interface IEventPublisher {
  publish: (event: IEvent) => Promise<void>;
}

export interface IEventSubscriber {
  subscribe: (event: string, callback: Function) => Promise<void>;
}

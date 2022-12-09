/* eslint-disable @typescript-eslint/ban-types */
export interface IQueueConnection {
  connect: () => Promise<void>;
  close: () => Promise<void>;
}

export interface IQueuePublisher {
  publish: (event: string, data: any) => Promise<void>;
}

export interface IQueueConsumer {
  consume: (event: string, callback: Function) => Promise<void>;
}

export type IQueue = IQueueConnection & IQueueConsumer & IQueuePublisher;

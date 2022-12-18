/* eslint-disable @typescript-eslint/ban-types */
export interface QueueConnection {
  createChannel: () => Promise<void>;
  closeChannel: () => Promise<void>;
  close: () => Promise<void>;
}

export interface QueuePublisher {
  publish: (event: string, data: any) => Promise<void>;
}

export interface QueueConsumer {
  consume: (event: string, callback: Function) => Promise<void>;
}

export type Queue = QueueConnection & QueueConsumer & QueuePublisher;

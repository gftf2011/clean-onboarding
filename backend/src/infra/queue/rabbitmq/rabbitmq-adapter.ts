/* eslint-disable @typescript-eslint/ban-types */
import { Connection, ConsumeMessage } from 'amqplib';

import { IQueue } from '../../../application/contracts/queue';

import { RabbitmqConnection } from './connection';

export class RabbitmqAdapter implements IQueue {
  private connection: Connection;

  public async connect(): Promise<void> {
    this.connection = RabbitmqConnection.getInstance().getConnection();
  }

  public async close(): Promise<void> {
    await this.connection.close();
  }

  public async consume(event: string, callback: Function): Promise<void> {
    const channel = await this.connection.createChannel();
    await channel.assertQueue(event, { durable: true });
    await channel.consume(event, async (msg: ConsumeMessage) => {
      if (msg) {
        const input = JSON.parse(msg.content.toString());
        await callback(input);
        channel.ack(msg);
      }
    });
  }

  public async publish(event: string, data: any): Promise<void> {
    const channel = await this.connection.createChannel();
    await channel.assertQueue(event, { durable: true });
    channel.sendToQueue(event, Buffer.from(JSON.stringify(data)), {
      persistent: true,
    });
  }
}

/* eslint-disable @typescript-eslint/ban-types */
import { ConsumeMessage, Channel } from 'amqplib';

import { IQueue } from '../../../application/contracts/queue';

import { RabbitmqConnection } from './connection';

export class RabbitmqAdapter implements IQueue {
  private channel: Channel;

  public async createChannel(): Promise<void> {
    this.channel = await RabbitmqConnection.getInstance()
      .getConnection()
      .createChannel();
  }

  public async consume(action: string, callback: Function): Promise<void> {
    await this.channel.assertQueue(action, { durable: true });
    await this.channel.consume(action, async (msg: ConsumeMessage) => {
      if (msg) {
        const input = JSON.parse(msg.content.toString());
        await callback(input);
        this.channel.ack(msg);
      }
    });
  }

  public async publish(action: string, data: any): Promise<void> {
    await this.channel.assertQueue(action, { durable: true });
    this.channel.sendToQueue(action, Buffer.from(JSON.stringify(data)), {
      persistent: true,
    });
  }

  public async closeChannel(): Promise<void> {
    await this.channel.close();
  }

  public async close(): Promise<void> {
    await RabbitmqConnection.getInstance().getConnection().close();
  }
}

import { Connection, Options, connect } from 'amqplib';

export class RabbitmqConnection {
  private static instance: RabbitmqConnection;

  private static connection: Connection;

  private constructor() {}

  public async connect(config: Options.Connect): Promise<void> {
    if (!RabbitmqConnection.connection) {
      /**
       * Retry connection logic, queue connection is not immediate
       */
      while (!RabbitmqConnection.connection) {
        try {
          RabbitmqConnection.connection = await connect(config);
        } catch (err) {
          RabbitmqConnection.connection = null;
        }
      }
    }
  }

  public static getInstance(): RabbitmqConnection {
    if (!RabbitmqConnection.instance) {
      RabbitmqConnection.instance = new RabbitmqConnection();
    }
    return RabbitmqConnection.instance;
  }

  public getConnection(): Connection {
    return RabbitmqConnection.connection;
  }
}

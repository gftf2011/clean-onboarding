import { Pool, PoolClient } from 'pg';

import { PostgresPoolConfig } from '../config';

import { Connection } from '../../../../application/contracts/database';

// It uses the singleton design pattern
export class PostgresConnection implements Connection {
  private static pool: Pool;

  private static instance: PostgresConnection;

  private constructor() {}

  static getInstance(): PostgresConnection {
    if (!this.instance) {
      this.instance = new PostgresConnection();
    }
    return this.instance;
  }

  public async connect(config: any): Promise<void> {
    if (!PostgresConnection.pool) {
      const pool = new PostgresPoolConfig()
        .addIdleTransactionTimeout(config.idleInTransactionSessionTimeout)
        .addQueryTimeout(config.queryTimeout)
        .addStatementTimeout(config.statementTimeout)
        .addConnectionTimeout(config.connectionTimeout)
        .addDb(config.database)
        .addHost(config.host)
        .addIdleTimeout(config.idleTimeout)
        .addMax(config.max)
        .addPass(config.password)
        .addPort(config.port)
        .addUser(config.user)
        .build();

      let poolConnection: PoolClient;

      /**
       * Retry connection logic, postgres pool must
       * be tested before clients are created
       */
      while (!poolConnection) {
        try {
          poolConnection = await pool.connect();
        } catch (err) {
          poolConnection = null;
        }
      }

      /**
       * If client is created to check connection it's necessary release the client
       */
      poolConnection.release();

      PostgresConnection.pool = pool;
    }
  }

  public async disconnect(): Promise<void> {
    await PostgresConnection.pool.end();
  }

  public async getConnection(): Promise<any> {
    return PostgresConnection.pool.connect();
  }
}

import { PoolClient } from 'pg';

import {
  Connection,
  Database,
  DatabaseQuery,
  DatabaseStatement,
} from '../../../application/contracts/database';

import { PostgresConnection } from './connection';

export class PostgresAdapter implements Database {
  private client: PoolClient;

  private connection: Connection;

  constructor() {
    this.connection = PostgresConnection.getInstance();
  }

  public async createClient(): Promise<void> {
    this.client = await this.connection.getConnection();
  }

  public async openTransaction(): Promise<void> {
    await this.client.query('BEGIN');
  }

  public async query(
    input: DatabaseQuery.Input,
  ): Promise<DatabaseQuery.Output> {
    return this.client.query(input.queryText, input.values);
  }

  public async statement(input: DatabaseStatement.Input): Promise<void> {
    this.client.query(input.queryText, input.values);
  }

  public async closeTransaction(): Promise<void> {
    this.client.release();
  }

  public async commit(): Promise<void> {
    await this.client.query('COMMIT');
  }

  public async rollback(): Promise<void> {
    await this.client.query('ROLLBACK');
  }

  public async close(): Promise<void> {
    await this.connection.disconnect();
  }
}

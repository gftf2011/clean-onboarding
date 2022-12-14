/**
 * Drivers
 */
import { Pool, PoolConfig } from 'pg';

// It uses the builder design pattern
export class PostgresPoolConfigBuilder {
  private pool: PoolConfig;

  public constructor() {
    this.reset();
  }

  private reset(): void {
    this.pool = {};
  }

  public addHost(host?: string): PostgresPoolConfigBuilder {
    this.pool.host = host;
    return this;
  }

  public addPort(port?: number): PostgresPoolConfigBuilder {
    this.pool.port = port;
    return this;
  }

  public addIdleTransactionTimeout(
    idleInTransactionSessionTimeout?: number,
  ): PostgresPoolConfigBuilder {
    this.pool.idle_in_transaction_session_timeout =
      idleInTransactionSessionTimeout;
    return this;
  }

  public addQueryTimeout(queryTimeout?: number): PostgresPoolConfigBuilder {
    this.pool.query_timeout = queryTimeout;
    return this;
  }

  public addStatementTimeout(
    statementTimeout?: number,
  ): PostgresPoolConfigBuilder {
    this.pool.statement_timeout = statementTimeout;
    return this;
  }

  public addUser(user?: string): PostgresPoolConfigBuilder {
    this.pool.user = user;
    return this;
  }

  public addPass(password?: string): PostgresPoolConfigBuilder {
    this.pool.password = password;
    return this;
  }

  public addDb(database?: string): PostgresPoolConfigBuilder {
    this.pool.database = database;
    return this;
  }

  public addMax(max?: number): PostgresPoolConfigBuilder {
    this.pool.max = max || this.pool.max;
    return this;
  }

  public addConnectionTimeout(
    connectionTimeout?: number,
  ): PostgresPoolConfigBuilder {
    this.pool.connectionTimeoutMillis = connectionTimeout;
    return this;
  }

  public addIdleTimeout(idleTimeout?: number): PostgresPoolConfigBuilder {
    this.pool.idleTimeoutMillis = idleTimeout;
    return this;
  }

  public build(): Pool {
    const result = new Pool({
      query_timeout: this.pool?.query_timeout,
      statement_timeout: this.pool?.statement_timeout,
      database: this.pool?.database,
      host: this.pool?.host,
      max: this.pool?.max,
      password: this.pool?.password,
      port: this.pool?.port,
      user: this.pool?.user,
      idle_in_transaction_session_timeout:
        this.pool?.idle_in_transaction_session_timeout,
      idleTimeoutMillis: this.pool?.idleTimeoutMillis,
      connectionTimeoutMillis: this.pool?.connectionTimeoutMillis,
    });
    this.reset();
    return result;
  }
}

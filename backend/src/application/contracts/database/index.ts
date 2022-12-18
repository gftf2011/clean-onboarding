export interface Connection {
  connect: (config: any) => Promise<void>;
  disconnect: () => Promise<void>;
  getConnection: () => Promise<any>;
}

export namespace DatabaseQuery {
  export type Input = any;
  export type Output = any;
}

export namespace DatabaseStatement {
  export type Input = any;
}

export interface DatabaseQuery {
  query: (input: DatabaseQuery.Input) => Promise<DatabaseQuery.Output>;
}

export interface DatabaseStatement {
  statement: (input: DatabaseStatement.Input) => Promise<void>;
}

export type Database = {
  openTransaction: () => Promise<void>;
  closeTransaction: () => Promise<void>;
  createClient: () => Promise<void>;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
  close: () => Promise<void>;
};

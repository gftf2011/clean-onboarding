export interface Connection {
  connect: (config: any) => Promise<void>;
  disconnect: () => Promise<void>;
  getConnection: () => Promise<any>;
}

export namespace IDatabaseQuery {
  export type Input = any;
  export type Output = any;
}

export namespace IDatabaseStatement {
  export type Input = any;
}

export interface IDatabaseQuery {
  query: (input: IDatabaseQuery.Input) => Promise<IDatabaseQuery.Output>;
}

export interface IDatabaseStatement {
  statement: (input: IDatabaseStatement.Input) => Promise<void>;
}

export type IDatabase = {
  openTransaction: () => Promise<void>;
  closeTransaction: () => Promise<void>;
  createClient: () => Promise<void>;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
  close: () => Promise<void>;
};

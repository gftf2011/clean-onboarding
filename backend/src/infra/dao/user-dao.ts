import {
  IDatabaseQuery,
  IDatabaseStatement,
} from '../../application/contracts/database';
import { IUserDao } from '../../application/contracts/dao';

import { UserModel as User } from '../../domain/models';

interface Parameters {
  queryText: string;
  values: any[];
}

type Rows = {
  rows: User[];
};

export class UserDao implements IUserDao {
  constructor(
    private readonly dependencies: {
      read: IDatabaseQuery;
      write: IDatabaseStatement;
    },
  ) {}

  async findByEmail(email: string): Promise<User> {
    const queryText = 'SELECT * FROM users_schema.users WHERE email LIKE $1';

    const values: any[] = [email];

    const input: Parameters = {
      queryText,
      values,
    };

    const response = (await this.dependencies.read.query(input)) as Rows;

    const parsedResponse: User = response.rows[0]
      ? {
          id: response.rows[0].id,
          email: response.rows[0].email,
          lastname: response.rows[0].lastname,
          name: response.rows[0].name,
          password: response.rows[0].password,
          document: response.rows[0].document,
          locale: response.rows[0].locale,
          phone: response.rows[0].phone,
        }
      : undefined;
    return parsedResponse;
  }

  async save(user: User): Promise<void> {
    const queryText =
      'INSERT INTO users_schema.users(id, name, lastname, document, email, password, phone, locale) VALUES($1, $2, $3, $4, $5, $6, $7, $8)';

    const values: any[] = [
      user.id,
      user.name,
      user.lastname,
      user.document,
      user.email,
      user.password,
      user.phone,
      user.locale,
    ];

    const input: Parameters = {
      queryText,
      values,
    };

    await this.dependencies.write.statement(input);
  }

  async update(user: User): Promise<void> {
    const queryText =
      'UPDATE users_schema.users SET id = $1, name = $2, lastname = $3, document = $4, email = $5, password = $6, phone = $7, locale = $8 WHERE id = $1';

    const values: any[] = [
      user.id,
      user.name,
      user.lastname,
      user.document,
      user.email,
      user.password,
      user.phone,
      user.locale,
    ];

    const input: Parameters = {
      queryText,
      values,
    };

    await this.dependencies.write.statement(input);
  }

  async delete(id: string): Promise<void> {
    const queryText = 'DELETE FROM users_schema.users WHERE id = $1';

    const values: any[] = [id];

    const input: Parameters = {
      queryText,
      values,
    };

    await this.dependencies.write.statement(input);
  }

  async find(id: string): Promise<User> {
    const queryText = 'SELECT * FROM users_schema.users WHERE id = $1';

    const values: any[] = [id];

    const input: Parameters = {
      queryText,
      values,
    };

    const response = (await this.dependencies.read.query(input)) as Rows;

    const parsedResponse: User = response.rows[0]
      ? {
          id: response.rows[0].id,
          email: response.rows[0].email,
          lastname: response.rows[0].lastname,
          name: response.rows[0].name,
          password: response.rows[0].password,
          document: response.rows[0].document,
          locale: response.rows[0].locale,
          phone: response.rows[0].phone,
        }
      : undefined;
    return parsedResponse;
  }

  async findAll(page: number, limit: number): Promise<User[]> {
    const queryText =
      'SELECT * FROM users_schema.users ORDER BY id LIMIT $1 OFFSET $2';

    const values: any[] = [limit, limit * page];

    const input: Parameters = {
      queryText,
      values,
    };

    const response = (await this.dependencies.read.query(input)) as Rows;

    const parsedResponse: User[] = response.rows[0]
      ? response.rows.map(item => ({
          id: item.id,
          email: item.email,
          lastname: item.lastname,
          name: item.name,
          password: item.password,
          document: item.document,
          phone: item.phone,
          locale: item.locale,
        }))
      : [];
    return parsedResponse;
  }
}

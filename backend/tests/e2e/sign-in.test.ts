import '../../src/main/bootstrap';

import faker from 'faker';
import request from 'supertest';
import { RandomSSN } from 'ssn';

import { loader } from '../../src/main/loaders';
import server from '../../src/main/config/server';

import { PostgresAdapter } from '../../src/infra/database/postgres/postgres-adapter';

import {
  UserDoNotExistsError,
  PasswordDoesNotMatchError,
} from '../../src/application/errors';

describe('Sign-In Route', () => {
  let postgres: PostgresAdapter;

  beforeAll(async () => {
    await loader();

    postgres = new PostgresAdapter();
  });

  describe('POST - /api/V1/sign-in', () => {
    it('should return 200 with a valid account', async () => {
      const email = 'test@mail.com';
      const password = '12345678xX@';
      const name = 'test';
      const lastname = 'test';
      const locale = 'UNITED_STATES_OF_AMERICA';
      const phone = faker.phone.phoneNumber('##########');
      const document = new RandomSSN().value().toString();

      let response = await request(server).post('/api/V1/sign-up').send({
        email,
        password,
        name,
        lastname,
        locale,
        phone,
        document,
      });

      expect(response.status).toBe(204);

      response = await request(server).post('/api/V1/sign-in').send({
        email,
        password,
      });

      expect(response.status).toBe(200);
      expect(response.body.auth).toBeDefined();
    });

    it('should return 401 if user is not found', async () => {
      const email = 'test@mail.com';
      const password = '12345678xX@';

      const response = await request(server).post('/api/V1/sign-in').send({
        email,
        password,
      });

      const error = new UserDoNotExistsError();

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: error.message,
        name: error.name,
      });
    });

    it('should return 403 if user password does not match', async () => {
      const email = 'test@mail.com';
      const password = '12345678xX@';
      const name = 'test';
      const lastname = 'test';
      const locale = 'UNITED_STATES_OF_AMERICA';
      const phone = faker.phone.phoneNumber('##########');
      const document = new RandomSSN().value().toString();

      let response = await request(server).post('/api/V1/sign-up').send({
        email,
        password,
        name,
        lastname,
        locale,
        phone,
        document,
      });

      expect(response.status).toBe(204);

      response = await request(server).post('/api/V1/sign-in').send({
        email,
        password: '12345670zZ$',
      });

      const error = new PasswordDoesNotMatchError();

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        message: error.message,
        name: error.name,
      });
    });

    afterEach(async () => {
      await postgres.createClient();
      await postgres.openTransaction();
      await postgres.statement({
        queryText: 'DELETE FROM users_schema.users',
        values: [],
      });
      await postgres.commit();
      await postgres.closeTransaction();
    });
  });

  afterAll(async () => {
    await postgres.close();
  });
});

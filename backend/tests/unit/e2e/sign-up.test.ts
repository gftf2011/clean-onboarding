import '../../../src/main/bootstrap';

import faker from 'faker';
import request from 'supertest';
import { RandomSSN } from 'ssn';

import { loader } from '../../../src/main/loaders';
import server from '../../../src/main/config/server';

import { PostgresAdapter } from '../../../src/infra/database/postgres/postgres-adapter';

import { InvalidEmailError } from '../../../src/domain/errors';

import { UserAlreadyExistsError } from '../../../src/application/errors';

describe('Sign-Up Route', () => {
  let postgres: PostgresAdapter;

  beforeAll(async () => {
    await loader();

    postgres = new PostgresAdapter();
  });

  describe('POST - /api/V1/sign-up', () => {
    it('should return 204 with a valid user', async () => {
      const email = 'test@mail.com';
      const password = '12345678xX@';
      const name = 'test';
      const lastname = 'test';
      const locale = 'UNITED_STATES_OF_AMERICA';
      const phone = faker.phone.phoneNumber('##########');
      const document = new RandomSSN().value().toString();

      const response = await request(server).post('/api/V1/sign-up').send({
        email,
        password,
        name,
        lastname,
        locale,
        phone,
        document,
      });

      expect(response.status).toBe(204);
    });

    it('should return 400 with invalid email', async () => {
      const email = '';
      const password = '12345678xX@';
      const name = 'test';
      const lastname = 'test';
      const locale = 'UNITED_STATES_OF_AMERICA';
      const phone = faker.phone.phoneNumber('##########');
      const document = new RandomSSN().value().toString();

      const response = await request(server).post('/api/V1/sign-up').send({
        email,
        password,
        name,
        lastname,
        locale,
        phone,
        document,
      });

      const error = new InvalidEmailError('');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: error.message,
        name: error.name,
      });
    });

    it('should return 403 with a duplicated email', async () => {
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

      response = await request(server).post('/api/V1/sign-up').send({
        email,
        password,
        name,
        lastname,
        locale,
        phone,
        document,
      });

      const error = new UserAlreadyExistsError();

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

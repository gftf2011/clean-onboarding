import '../../../src/main/bootstrap';

import faker from 'faker';
import request from 'supertest';
import { RandomSSN } from 'ssn';

import { loader } from '../../../src/main/loaders';
import server from '../../../src/main/config/server';

import { PostgresAdapter } from '../../../src/infra/database/postgres/postgres-adapter';

describe('Sign-Up Route', () => {
  beforeAll(async () => {
    await loader();
  });

  describe('POST - /api/V1/sign-up', () => {
    it('should sign-up a valid user', async () => {
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
  });

  afterAll(async () => {
    const database = new PostgresAdapter();
    await database.close();
  });
});

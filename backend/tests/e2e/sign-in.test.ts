/* eslint-disable func-names */
import '../../src/main/bootstrap';

import faker from 'faker';
import request from 'supertest';
import { RandomSSN } from 'ssn';

import nodemailer from 'nodemailer';

import { loader } from '../../src/main/loaders';
import server from '../../src/main/config/server';
import broker from '../../src/main/config/broker';

import { RabbitmqAdapter } from '../../src/infra/queue/rabbitmq/rabbitmq-adapter';
import { PostgresAdapter } from '../../src/infra/database/postgres/postgres-adapter';
import { TokenProvider, UUIDProvider } from '../../src/infra/providers';

import {
  UserDoNotExistsError,
  PasswordDoesNotMatchError,
} from '../../src/application/errors';
import { NAMESPACES } from '../../src/application/contracts/providers';

import { UserModel as User } from '../../src/domain/models';

jest.mock('nodemailer');

describe('Sign-In Route', () => {
  let postgres: PostgresAdapter;
  let rabbitmq: RabbitmqAdapter;

  const closeAllConnections = async (): Promise<void> => {
    await postgres.close();
    await rabbitmq.close();
  };

  const cleanAllUsers = async (): Promise<void> => {
    await postgres.createClient();
    await postgres.openTransaction();
    await postgres.statement({
      queryText: 'DELETE FROM users_schema.users',
      values: [],
    });
    await postgres.commit();
    await postgres.closeTransaction();
  };

  const createToken = (data: { payload: any; subject: string }): string => {
    const uuidProvider = new UUIDProvider();
    const tokenProvider = new TokenProvider('1h');

    const token = tokenProvider.sign({
      payload: data.payload,
      secret: process.env.JWT_SECRET || '',
      subject: uuidProvider.generateV5(
        data.subject,
        NAMESPACES.USER_ACCESS_TOKEN,
      ),
    });

    return token;
  };

  const findUser = async (input: { email: string }): Promise<User> => {
    await postgres.createClient();
    await postgres.openTransaction();

    const response = await postgres.query({
      queryText: 'SELECT * FROM users_schema.users WHERE email LIKE $1',
      values: [input.email],
    });

    await postgres.commit();
    await postgres.closeTransaction();

    return {
      id: response.rows[0].id,
      email: response.rows[0].email,
      lastname: response.rows[0].lastname,
      name: response.rows[0].name,
      password: response.rows[0].password,
      document: response.rows[0].document,
      locale: response.rows[0].locale,
      phone: response.rows[0].phone,
    };
  };

  const sleep = (timeout: number): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, timeout);
    });
  };

  beforeAll(async () => {
    await loader();
    await broker();

    postgres = new PostgresAdapter();
    rabbitmq = new RabbitmqAdapter();
  });

  describe('POST - /api/V1/sign-in', () => {
    beforeEach(() => {
      /**
       * Most important - it clears the cache
       */
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return 200 with a valid account', async () => {
      const sendMailSpy = jest.fn();

      (nodemailer.createTransport as any).mockReturnValue({
        sendMail: sendMailSpy,
      });

      const user = {
        email: 'test@mail.com',
        password: '12345678xX@',
        name: 'test',
        lastname: 'test',
        locale: 'UNITED_STATES_OF_AMERICA',
        phone: faker.phone.phoneNumber('##########'),
        document: new RandomSSN().value().toString(),
      };

      const signUpResponse = await request(server)
        .post('/api/V1/sign-up')
        .send(user);

      const signInResponse = await request(server)
        .post('/api/V1/sign-in')
        .send({
          email: user.email,
          password: user.password,
        });

      await sleep(500);

      const userFound = await findUser({ email: user.email });

      const token = createToken({
        payload: { id: userFound.id },
        subject: userFound.email,
      });

      expect(sendMailSpy).toHaveBeenCalledTimes(1);
      expect(signUpResponse.status).toBe(204);
      expect(signInResponse.status).toBe(200);
      expect(signInResponse.body).toEqual({
        auth: `Bearer ${token}`,
      });
    });

    it('should return 401 if user is not found', async () => {
      const account = {
        email: 'test@mail.com',
        password: '12345678xX@',
      };
      const error = new UserDoNotExistsError();

      const response = await request(server)
        .post('/api/V1/sign-in')
        .send(account);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: error.message,
        name: error.name,
      });
    });

    it('should return 403 if user password does not match', async () => {
      const sendMailSpy = jest.fn();

      (nodemailer.createTransport as any).mockReturnValue({
        sendMail: sendMailSpy,
      });

      const user = {
        email: 'test@mail.com',
        password: '12345678xX@',
        name: 'test',
        lastname: 'test',
        locale: 'UNITED_STATES_OF_AMERICA',
        phone: faker.phone.phoneNumber('##########'),
        document: new RandomSSN().value().toString(),
      };
      const account = {
        email: user.email,
        password: '12345670zZ$',
      };
      const error = new PasswordDoesNotMatchError();

      const signUpResponse = await request(server)
        .post('/api/V1/sign-up')
        .send(user);

      await sleep(500);

      const signInResponse = await request(server)
        .post('/api/V1/sign-in')
        .send(account);

      expect(signUpResponse.status).toBe(204);

      expect(signInResponse.status).toBe(403);
      expect(signInResponse.body).toEqual({
        message: error.message,
        name: error.name,
      });
    });

    afterEach(async () => {
      await cleanAllUsers();
    });
  });

  afterAll(async () => {
    await closeAllConnections();
  });
});

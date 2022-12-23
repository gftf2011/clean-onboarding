/* eslint-disable func-names */
import '../../src/main/bootstrap';

import faker from 'faker';
import request, { Response } from 'supertest';
import { RandomSSN } from 'ssn';

import nodemailer from 'nodemailer';

import { loader } from '../../src/main/loaders';
import server from '../../src/main/config/server';
import broker from '../../src/main/config/broker';

import { RabbitmqAdapter } from '../../src/infra/queue/rabbitmq/rabbitmq-adapter';
import { PostgresAdapter } from '../../src/infra/database/postgres/postgres-adapter';
import { HashSha512ProviderCreator } from '../../src/infra/providers';

import { AccountDTO, UserDTO } from '../../src/domain/dtos';
import { UserModel } from '../../src/domain/models';
import { InvalidPasswordError } from '../../src/domain/errors';

import {
  MissingBodyParamsError,
  MissingHeaderParamsError,
  TokenExpiredError,
  UserDoNotExistsError,
} from '../../src/application/errors';

jest.mock('nodemailer');

describe('Change-User-Password Route', () => {
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

  const findUser = async (input: { email: string }): Promise<UserModel> => {
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

  const hashPassword = async (
    password: string,
    salt: string,
  ): Promise<string> => {
    const hashProvider = new HashSha512ProviderCreator();
    const response = await hashProvider.encode(password, salt);
    return response;
  };

  const sleep = (timeout: number): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, timeout);
    });
  };

  const signUpRequest = async (user: UserDTO): Promise<Response> => {
    const response = await request(server).post('/api/V1/sign-up').send(user);
    return response;
  };

  const signInRequest = async (account: AccountDTO): Promise<Response> => {
    const response = await request(server).post('/api/V1/sign-in').send({
      email: account.email,
      password: account.password,
    });
    return response;
  };

  const changePasswordRequest = async (
    password: string,
    accessToken: string,
  ): Promise<Response> => {
    const response = await request(server)
      .post('/api/V1/change-user-password')
      .send({ password })
      .set('Authorization', accessToken);

    return response;
  };

  const changePasswordRequestWithNoAuthorization = async (
    password: string,
  ): Promise<Response> => {
    const response = await request(server)
      .post('/api/V1/change-user-password')
      .send({ password });

    return response;
  };

  const changePasswordRequestWithNoPassword = async (
    accessToken: string,
  ): Promise<Response> => {
    const response = await request(server)
      .post('/api/V1/change-user-password')
      .send({})
      .set('Authorization', accessToken);

    return response;
  };

  beforeAll(async () => {
    await loader();
    await broker();

    postgres = new PostgresAdapter();
    rabbitmq = new RabbitmqAdapter();
  });

  describe('POST - /api/V1/change-user-password', () => {
    beforeEach(() => {
      /**
       * Most important - it clears the cache
       */
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return 204 when password is changed', async () => {
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
      const userWithNewPassword = {
        ...user,
        password: '12345670zZ#',
      };

      const signUpResponse = await signUpRequest(user);
      const signInResponse = await signInRequest({
        email: user.email,
        password: user.password,
      });

      await sleep(500);

      const userFound = await findUser({ email: user.email });

      const changeUserPasswordResponse = await changePasswordRequest(
        userWithNewPassword.password,
        signInResponse.body.auth,
      );

      const userFoundAfterPasswordChange = await findUser({
        email: userWithNewPassword.email,
      });

      expect(sendMailSpy).toHaveBeenCalledTimes(1);
      expect(signUpResponse.status).toBe(204);
      expect(signInResponse.status).toBe(200);
      expect(signInResponse.body).toBeDefined();
      expect(changeUserPasswordResponse.status).toBe(204);
      expect(userFound.id).toBe(userFoundAfterPasswordChange.id);
      expect(userFound.password).toBe(
        await hashPassword(user.password, `${user.email}$${user.document}`),
      );
      expect(userFoundAfterPasswordChange.password).toBe(
        await hashPassword(
          userWithNewPassword.password,
          `${userWithNewPassword.email}$${userWithNewPassword.document}`,
        ),
      );
    });

    it('should return 400 if any required header parameter is missing - middleware', async () => {
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
      const userWithNewPassword = {
        ...user,
        password: '123456',
      };

      const signUpResponse = await signUpRequest(user);
      const signInResponse = await signInRequest({
        email: user.email,
        password: user.password,
      });

      await sleep(500);

      const changeUserPasswordResponse =
        await changePasswordRequestWithNoAuthorization(
          userWithNewPassword.password,
        );

      const error = new MissingHeaderParamsError(['authorization']);

      expect(sendMailSpy).toHaveBeenCalledTimes(1);
      expect(signUpResponse.status).toBe(204);
      expect(signInResponse.status).toBe(200);
      expect(signInResponse.body).toBeDefined();
      expect(changeUserPasswordResponse.status).toBe(400);
      expect(changeUserPasswordResponse.body).toEqual({
        message: error.message,
        name: error.name,
      });
    });

    it('should return 400 if any required body parameter is missing', async () => {
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

      const signUpResponse = await signUpRequest(user);
      const signInResponse = await signInRequest({
        email: user.email,
        password: user.password,
      });

      await sleep(500);

      const changeUserPasswordResponse =
        await changePasswordRequestWithNoPassword(signInResponse.body.auth);

      const error = new MissingBodyParamsError(['password']);

      expect(sendMailSpy).toHaveBeenCalledTimes(1);
      expect(signUpResponse.status).toBe(204);
      expect(signInResponse.status).toBe(200);
      expect(signInResponse.body).toBeDefined();
      expect(changeUserPasswordResponse.status).toBe(400);
      expect(changeUserPasswordResponse.body).toEqual({
        message: error.message,
        name: error.name,
      });
    });

    it('should return 400 when password is not strong enough', async () => {
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
      const userWithNewPassword = {
        ...user,
        password: '123456',
      };

      const signUpResponse = await signUpRequest(user);
      const signInResponse = await signInRequest({
        email: user.email,
        password: user.password,
      });

      await sleep(500);

      const userFound = await findUser({ email: user.email });

      const changeUserPasswordResponse = await changePasswordRequest(
        userWithNewPassword.password,
        signInResponse.body.auth,
      );

      const userFoundAfterPasswordChange = await findUser({
        email: userWithNewPassword.email,
      });

      const error = new InvalidPasswordError();

      expect(sendMailSpy).toHaveBeenCalledTimes(1);
      expect(signUpResponse.status).toBe(204);
      expect(signInResponse.status).toBe(200);
      expect(signInResponse.body).toBeDefined();
      expect(userFound.id).toBe(userFoundAfterPasswordChange.id);
      expect(changeUserPasswordResponse.status).toBe(400);
      expect(changeUserPasswordResponse.body).toEqual({
        message: error.message,
        name: error.name,
      });
    });

    it('should return 401 if token is expirerd', async () => {
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
      const userWithNewPassword = {
        ...user,
        password: '12345670zZ#',
      };

      const signUpResponse = await signUpRequest(user);
      const signInResponse = await signInRequest({
        email: user.email,
        password: user.password,
      });

      await sleep(5000);

      const changeUserPasswordResponse = await changePasswordRequest(
        userWithNewPassword.password,
        signInResponse.body.auth,
      );

      const error = new TokenExpiredError();

      expect(sendMailSpy).toHaveBeenCalledTimes(1);
      expect(signUpResponse.status).toBe(204);
      expect(signInResponse.status).toBe(200);
      expect(signInResponse.body).toBeDefined();
      expect(changeUserPasswordResponse.status).toBe(401);
      expect(changeUserPasswordResponse.body).toEqual({
        message: error.message,
        name: error.name,
      });
    });

    it('should return 401 if user do not exists', async () => {
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
      const userWithNewPassword = {
        ...user,
        password: '12345670zZ#',
      };

      const signUpResponse = await signUpRequest(user);
      const signInResponse = await signInRequest({
        email: user.email,
        password: user.password,
      });

      await sleep(500);

      await cleanAllUsers();

      const changeUserPasswordResponse = await changePasswordRequest(
        userWithNewPassword.password,
        signInResponse.body.auth,
      );

      const error = new UserDoNotExistsError();

      expect(sendMailSpy).toHaveBeenCalledTimes(1);
      expect(signUpResponse.status).toBe(204);
      expect(signInResponse.status).toBe(200);
      expect(signInResponse.body).toBeDefined();
      expect(changeUserPasswordResponse.status).toBe(401);
      expect(changeUserPasswordResponse.body).toEqual({
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

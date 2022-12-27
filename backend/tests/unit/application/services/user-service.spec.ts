import faker from 'faker';
import { RandomSSN } from 'ssn';

import { Nationalities } from '../../../../src/domain/contracts';
import { UserModel } from '../../../../src/domain/models';
import { UserDTO } from '../../../../src/domain/dtos';

import { UserService } from '../../../../src/application/services';
import {
  ChangeUserPasswordAction,
  CreateUserAction,
  FindUserAction,
  FindUserByEmailAction,
} from '../../../../src/application/actions';

import { CommandBusDummy } from '../../../doubles/dummies/bus/commands';
import { QueryBusDummy } from '../../../doubles/dummies/bus/queries';
import { QueryBusStub } from '../../../doubles/stubs/bus/queries';
import { CommandBusSpy } from '../../../doubles/spies/bus/commands';
import { QueryBusSpy } from '../../../doubles/spies/bus/queries';

describe('User Application Service', () => {
  describe('findByEmail - method', () => {
    it('should return an user as expected result', async () => {
      const user: UserModel = {
        id: faker.datatype.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.name.firstName(),
        lastname: faker.name.lastName(),
        phone: faker.phone.phoneNumber('##########'),
        document: new RandomSSN().value().toString(),
        locale: 'UNITED_STATES_OF_AMERICA',
      };
      const queryBus = new QueryBusStub(user);
      const commandBus = new CommandBusDummy();

      const sut = new UserService(commandBus, queryBus);

      const response = await sut.findByEmail(user.email);

      expect(response).toEqual(user);
    });

    it('should check action', async () => {
      const userEmail = faker.internet.email();
      const action = new FindUserByEmailAction({
        email: userEmail,
      });

      const queryBus = new QueryBusSpy();
      const commandBus = new CommandBusDummy();

      const sut = new UserService(commandBus, queryBus);

      await sut.findByEmail(userEmail);

      expect(queryBus.actions[0].operation).toBe(action.operation);
      expect(queryBus.actions[0].data).toEqual(action.data);
    });
  });

  describe('find - method', () => {
    it('should return an user as expected result', async () => {
      const user: UserModel = {
        id: faker.datatype.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.name.firstName(),
        lastname: faker.name.lastName(),
        phone: faker.phone.phoneNumber('##########'),
        document: new RandomSSN().value().toString(),
        locale: 'UNITED_STATES_OF_AMERICA',
      };
      const queryBus = new QueryBusStub(user);
      const commandBus = new CommandBusDummy();

      const sut = new UserService(commandBus, queryBus);

      const response = await sut.find(user.id);

      expect(response).toEqual(user);
    });

    it('should check action', async () => {
      const userId = faker.datatype.uuid();
      const action = new FindUserAction({
        id: userId,
      });

      const queryBus = new QueryBusSpy();
      const commandBus = new CommandBusDummy();

      const sut = new UserService(commandBus, queryBus);

      await sut.find(userId);

      expect(queryBus.actions[0].operation).toBe(action.operation);
      expect(queryBus.actions[0].data).toEqual(action.data);
    });
  });

  describe('save - method', () => {
    it('should check action', async () => {
      const user: UserDTO = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.name.firstName(),
        lastname: faker.name.lastName(),
        phone: faker.phone.phoneNumber('##########'),
        document: new RandomSSN().value().toString(),
        locale: 'UNITED_STATES_OF_AMERICA',
      };
      const action = new CreateUserAction({
        locale: user.locale as Nationalities,
        user: {
          document: user.document,
          email: user.email,
          lastname: user.lastname,
          name: user.name,
          password: user.password,
          phone: user.phone,
        },
      });
      const queryBus = new QueryBusDummy();
      const commandBus = new CommandBusSpy();

      const sut = new UserService(commandBus, queryBus);

      await sut.save(user);

      expect(commandBus.actions[0].operation).toBe(action.operation);
      expect(commandBus.actions[0].data).toEqual(action.data);
    });
  });

  describe('changeUserPassword - method', () => {
    it('should check action', async () => {
      const user: UserModel = {
        id: faker.datatype.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.name.firstName(),
        lastname: faker.name.lastName(),
        phone: faker.phone.phoneNumber('##########'),
        document: new RandomSSN().value().toString(),
        locale: 'UNITED_STATES_OF_AMERICA',
      };
      const action = new ChangeUserPasswordAction({
        locale: user.locale as Nationalities,
        user: {
          id: user.id,
          document: user.document,
          email: user.email,
          lastname: user.lastname,
          name: user.name,
          password: user.password,
          phone: user.phone,
        },
      });
      const queryBus = new QueryBusDummy();
      const commandBus = new CommandBusSpy();

      const sut = new UserService(commandBus, queryBus);

      await sut.changeUserPassword(user.id, {
        ...user,
      });

      expect(commandBus.actions[0].operation).toBe(action.operation);
      expect(commandBus.actions[0].data).toEqual(action.data);
    });
  });
});

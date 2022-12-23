import faker from 'faker';
import { RandomSSN } from 'ssn';

import { UserModel } from '../../../../src/domain/models';

import { UserService } from '../../../../src/application/services';

import { CommandBusDummy } from '../../../doubles/dummies/bus/commands';
import { QueryBusStub } from '../../../doubles/stubs/bus/queries';

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
  });
});

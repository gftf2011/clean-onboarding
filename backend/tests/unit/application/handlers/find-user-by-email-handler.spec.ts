import faker from 'faker';
import { RandomSSN } from 'ssn';

import { LocalUserRepositoryFactory } from '../../../../src/infra/repositories';

import { FindUserByEmailAction } from '../../../../src/application/actions';
import { FindUserByEmailHandler } from '../../../../src/application/handlers';
import { UserModel } from '../../../../src/domain/models';

describe('Find User By Email Handler', () => {
  it('should return user if user exists', async () => {
    const user: UserModel = {
      id: faker.datatype.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      locale: 'UNITED_STATES_OF_AMERICA',
      phone: faker.phone.phoneNumber('##########'),
      document: new RandomSSN().value().toString(),
    };
    const repository = new LocalUserRepositoryFactory().createRepository();

    await repository.save(user);

    const action = new FindUserByEmailAction({ email: user.email });
    const handler = new FindUserByEmailHandler(repository);
    const response = await handler.handle(action);

    expect(response).toEqual(user);
  });

  it('should return "undefined" if user does not exists', async () => {
    const userEmail = faker.internet.email();
    const repository = new LocalUserRepositoryFactory().createRepository();

    const action = new FindUserByEmailAction({ email: userEmail });
    const handler = new FindUserByEmailHandler(repository);
    const response = await handler.handle(action);

    expect(response).toBeUndefined();
  });
});

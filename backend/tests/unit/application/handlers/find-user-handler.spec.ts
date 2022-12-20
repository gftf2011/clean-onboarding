import faker from 'faker';
import { RandomSSN } from 'ssn';

import { LocalUserRepositoryFactory } from '../../../../src/infra/repositories';

import { FindUserAction } from '../../../../src/application/actions';
import { FindUserHandler } from '../../../../src/application/handlers';
import { UserModel } from '../../../../src/domain/models';

describe('Find User Handler', () => {
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

    const action = new FindUserAction({ id: user.id });
    const handler = new FindUserHandler(repository);
    const response = await handler.handle(action);

    expect(response).toEqual(user);
  });

  it('should return "undefined" if user does not exists', async () => {
    const userId = faker.datatype.uuid();
    const repository = new LocalUserRepositoryFactory().createRepository();
    const action = new FindUserAction({ id: userId });
    const handler = new FindUserHandler(repository);
    const response = await handler.handle(action);

    expect(response).toBeUndefined();
  });
});

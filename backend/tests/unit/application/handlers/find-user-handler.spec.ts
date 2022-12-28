import faker from 'faker';
import { RandomSSN } from 'ssn';

import { LocalUserRepositoryFactory } from '../../../../src/infra/repositories';

import { FindUserAction } from '../../../../src/application/actions';
import { FindUserHandler } from '../../../../src/application/handlers';

describe('Find User Handler', () => {
  const makeUser = (): any => {
    return {
      id: faker.datatype.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      locale: 'UNITED_STATES_OF_AMERICA',
      phone: faker.phone.phoneNumber('##########'),
      document: new RandomSSN().value().toString(),
    };
  };

  it('should return user if user exists', async () => {
    const user = makeUser();

    const repository = new LocalUserRepositoryFactory().createRepository();

    await repository.save(user);

    const action = new FindUserAction({ id: user.id });
    const sut = new FindUserHandler(repository);
    const response = await sut.handle(action);

    expect(response).toEqual(user);
  });

  it('should return "undefined" if user does not exists', async () => {
    const user = makeUser();

    const repository = new LocalUserRepositoryFactory().createRepository();
    const action = new FindUserAction({ id: user.id });
    const sut = new FindUserHandler(repository);
    const response = await sut.handle(action);

    expect(response).toBeUndefined();
  });
});

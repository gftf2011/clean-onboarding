import faker from 'faker';
import { RandomSSN } from 'ssn';

import { LocalUserRepositoryFactory } from '../../../../src/infra/repositories';

import { FindUserByEmailAction } from '../../../../src/application/actions';
import { FindUserByEmailHandler } from '../../../../src/application/handlers';

describe('Find User By Email Handler', () => {
  const makeUser = (): any => {
    return {
      id: faker.datatype.uuid(),
      document: new RandomSSN().value().toString(),
      email: faker.internet.email().toLowerCase(),
      lastname: faker.name.lastName().toLowerCase(),
      name: faker.name.firstName().toLowerCase(),
      password: faker.internet.password(),
      phone: faker.phone.phoneNumber('##########'),
      locale: 'UNITED_STATES_OF_AMERICA' as any,
    };
  };

  it('should return user if user exists', async () => {
    const user = makeUser();
    const repository = new LocalUserRepositoryFactory().createRepository();

    await repository.save(user);

    const action = new FindUserByEmailAction({ email: user.email });
    const sut = new FindUserByEmailHandler(repository);
    const response = await sut.handle(action);

    expect(response).toEqual(user);
  });

  it('should return "undefined" if user does not exists', async () => {
    const userEmail = faker.internet.email();
    const repository = new LocalUserRepositoryFactory().createRepository();

    const action = new FindUserByEmailAction({ email: userEmail });
    const sut = new FindUserByEmailHandler(repository);
    const response = await sut.handle(action);

    expect(response).toBeUndefined();
  });
});

import faker from 'faker';
import { RandomSSN } from 'ssn';

import { LocalUserRepositoryFactory } from '../../../../src/infra/repositories';

import { ChangeUserPasswordAction } from '../../../../src/application/actions';
import { ChangeUserPasswordHandler } from '../../../../src/application/handlers';

import { Nationalities } from '../../../../src/domain/contracts';

import { HashProviderStub } from '../../../doubles/stubs/providers';
import { InvalidPasswordError } from '../../../../src/domain/errors';

describe('Change User Password', () => {
  const makeUser = (invalidPassword: boolean): any => {
    return {
      id: faker.datatype.uuid(),
      document: new RandomSSN().value().toString(),
      email: faker.internet.email().toLowerCase(),
      lastname: faker.name.lastName().toLowerCase(),
      name: faker.name.firstName().toLowerCase(),
      password: invalidPassword ? '12345678aX' : '12345678aX%',
      phone: faker.phone.phoneNumber('##########'),
      locale: 'UNITED_STATES_OF_AMERICA' as any,
    };
  };

  it('should change user password', async () => {
    const hashProvider = new HashProviderStub();
    const repository = new LocalUserRepositoryFactory().createRepository();

    const user = makeUser(false);

    await repository.save(user);
    const userFoundBefore = await repository.find(user.id);

    const action = new ChangeUserPasswordAction({
      locale: user.locale as Nationalities,
      user: {
        id: user.id,
        document: user.document,
        email: user.email,
        lastname: user.lastname,
        name: user.name,
        password: '12345678cV#',
        phone: user.phone,
      },
    });
    const sut = new ChangeUserPasswordHandler(hashProvider, repository);
    await sut.handle(action);

    const userFoundAfter = await repository.find(user.id);

    expect(userFoundBefore.password).not.toBe(userFoundAfter.password);
  });

  it('should throw error if an user field is invalid', async () => {
    const hashProvider = new HashProviderStub();
    const repository = new LocalUserRepositoryFactory().createRepository();

    const user = makeUser(true);

    const action = new ChangeUserPasswordAction({
      locale: user.locale,
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
    const sut = new ChangeUserPasswordHandler(hashProvider, repository);
    const promise = sut.handle(action);

    await expect(promise).rejects.toThrowError(new InvalidPasswordError());
  });
});

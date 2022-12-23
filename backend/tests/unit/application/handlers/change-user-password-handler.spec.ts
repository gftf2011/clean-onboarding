import faker from 'faker';
import { RandomSSN } from 'ssn';

import { LocalUserRepositoryFactory } from '../../../../src/infra/repositories';

import { ChangeUserPasswordAction } from '../../../../src/application/actions';
import { ChangeUserPasswordHandler } from '../../../../src/application/handlers';

import { UserModel } from '../../../../src/domain/models';
import { Nationalities } from '../../../../src/domain/contracts';

import { HashProviderStub } from '../../../doubles/stubs/providers';
import { InvalidPasswordError } from '../../../../src/domain/errors';

describe('Change User Password', () => {
  it('should change user password', async () => {
    const hashProvider = new HashProviderStub();
    const repository = new LocalUserRepositoryFactory().createRepository();

    const user: UserModel = {
      id: faker.datatype.uuid(),
      document: new RandomSSN().value().toString(),
      email: faker.internet.email().toLowerCase(),
      lastname: faker.name.lastName().toLowerCase(),
      name: faker.name.firstName().toLowerCase(),
      password: '12345678aX%',
      phone: faker.phone.phoneNumber('##########'),
      locale: 'UNITED_STATES_OF_AMERICA',
    };

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
    const handler = new ChangeUserPasswordHandler(hashProvider, repository);
    await handler.handle(action);

    const userFoundAfter = await repository.find(user.id);

    expect(userFoundBefore.id).toBe(userFoundAfter.id);
    expect(userFoundBefore.document).toBe(userFoundAfter.document);
    expect(userFoundBefore.email).toBe(userFoundAfter.email);
    expect(userFoundBefore.lastname).toBe(userFoundAfter.lastname);
    expect(userFoundBefore.name).toBe(userFoundAfter.name);
    expect(userFoundBefore.phone).toBe(userFoundAfter.phone);
    expect(userFoundBefore.locale).toBe(userFoundAfter.locale);

    expect(userFoundBefore.password).not.toBe(userFoundAfter.password);
  });

  it('should throw error if an user field is invalid', async () => {
    const hashProvider = new HashProviderStub();
    const repository = new LocalUserRepositoryFactory().createRepository();

    const invalidPassword = '12345678aX';

    const action = new ChangeUserPasswordAction({
      locale: 'UNITED_STATES_OF_AMERICA' as Nationalities,
      user: {
        id: faker.datatype.uuid(),
        document: new RandomSSN().value().toString(),
        email: faker.internet.email().toLowerCase(),
        lastname: faker.name.lastName().toLowerCase(),
        name: faker.name.firstName().toLowerCase(),
        password: invalidPassword,
        phone: faker.phone.phoneNumber('##########'),
      },
    });
    const handler = new ChangeUserPasswordHandler(hashProvider, repository);
    const promise = handler.handle(action);

    await expect(promise).rejects.toThrowError(new InvalidPasswordError());
  });
});

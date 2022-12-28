import faker from 'faker';
import { RandomSSN } from 'ssn';

import { LocalUserRepositoryFactory } from '../../../../src/infra/repositories';

import {
  CreateUserAction,
  SendWelcomeEmailAction,
} from '../../../../src/application/actions';
import { CreateUserHandler } from '../../../../src/application/handlers';

import { ActionPublisherSpy } from '../../../doubles/spies/queue/publishers';
import {
  HashProviderStub,
  IDProviderStub,
} from '../../../doubles/stubs/providers';
import { InvalidEmailError } from '../../../../src/domain/errors';

describe('Create User Handler', () => {
  const makeUser = (invalidEmail: boolean): any => {
    return {
      id: faker.datatype.uuid(),
      email: invalidEmail ? '' : faker.internet.email(),
      password: '12345678aX%',
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      phone: faker.phone.phoneNumber('##########'),
      document: new RandomSSN().value().toString(),
      locale: 'UNITED_STATES_OF_AMERICA' as any,
    };
  };

  it('should create user if it not exists first', async () => {
    const user = makeUser(false);

    const idProvider = new IDProviderStub(user.id);
    const hashProvider = new HashProviderStub();
    const repository = new LocalUserRepositoryFactory().createRepository();
    const publisher = new ActionPublisherSpy();

    const action = new CreateUserAction({
      locale: user.locale,
      user: {
        document: user.document,
        email: user.email,
        lastname: user.lastname,
        name: user.name,
        password: user.password,
        phone: user.phone,
      },
    });
    const sut = new CreateUserHandler(
      idProvider,
      hashProvider,
      repository,
      publisher,
    );

    await sut.handle(action);

    const foundUser = await repository.findByEmail(user.email.toLowerCase());

    expect(foundUser).toEqual({
      id: idProvider.generateV4(),
      email: user.email.toLowerCase(),
      lastname: user.lastname.toLowerCase(),
      name: user.name.toLowerCase(),
      password: await hashProvider.encode(
        user.password,
        `${user.email.toLowerCase()}$${user.document}`,
      ),
      phone: user.phone,
      document: user.document,
      locale: user.locale,
    });
  });

  it('should check action to send email', async () => {
    const user = makeUser(false);

    const idProvider = new IDProviderStub(user.id);
    const hashProvider = new HashProviderStub();
    const repository = new LocalUserRepositoryFactory().createRepository();
    const publisher = new ActionPublisherSpy();

    const action = new CreateUserAction({
      locale: user.locale,
      user: {
        document: user.document,
        email: user.email,
        lastname: user.lastname,
        name: user.name,
        password: user.password,
        phone: user.phone,
      },
    });
    const sut = new CreateUserHandler(
      idProvider,
      hashProvider,
      repository,
      publisher,
    );

    await sut.handle(action);

    const sendWelcomeEmailAction = new SendWelcomeEmailAction({
      fullName: `${user.name.toLowerCase()} ${user.lastname.toLowerCase()}`,
      to: user.email.toLowerCase(),
    });

    expect(publisher.actions[0]).toEqual(sendWelcomeEmailAction);
  });

  it('should throw error if an user field is invalid', async () => {
    const user = makeUser(true);

    const idProvider = new IDProviderStub();
    const hashProvider = new HashProviderStub();
    const repository = new LocalUserRepositoryFactory().createRepository();
    const publisher = new ActionPublisherSpy();

    const action = new CreateUserAction({
      locale: user.locale,
      user: {
        document: user.document,
        email: user.email,
        lastname: user.lastname,
        name: user.name,
        password: user.password,
        phone: user.phone,
      },
    });
    const sut = new CreateUserHandler(
      idProvider,
      hashProvider,
      repository,
      publisher,
    );

    const promise = sut.handle(action);

    await expect(promise).rejects.toThrowError(new InvalidEmailError(''));
  });
});

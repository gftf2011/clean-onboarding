import faker from 'faker';
import { RandomSSN } from 'ssn';

import { LocalUserRepositoryFactory } from '../../../../src/infra/repositories';

import { Nationalities } from '../../../../src/domain/contracts';

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
  it('should create user if it not exists first', async () => {
    const idProvider = new IDProviderStub();
    const hashProvider = new HashProviderStub();
    const repository = new LocalUserRepositoryFactory().createRepository();
    const publisher = new ActionPublisherSpy();

    const action = new CreateUserAction({
      locale: 'UNITED_STATES_OF_AMERICA' as Nationalities,
      user: {
        document: new RandomSSN().value().toString(),
        email: faker.internet.email(),
        lastname: faker.name.lastName(),
        name: faker.name.firstName(),
        password: '12345678aX%',
        phone: faker.phone.phoneNumber('##########'),
      },
    });
    const handler = new CreateUserHandler(
      idProvider,
      hashProvider,
      repository,
      publisher,
    );

    await handler.handle(action);

    const foundUser = await repository.findByEmail(
      action.data.user.email.toLowerCase(),
    );

    const sendWelcomeEmailAction = new SendWelcomeEmailAction({
      fullName: `${action.data.user.name.toLowerCase()} ${action.data.user.lastname.toLowerCase()}`,
      to: action.data.user.email.toLowerCase(),
    });

    expect(publisher.actions[0]).toEqual(sendWelcomeEmailAction);
    expect(foundUser).toEqual({
      id: '00000000-0000-0000-0000-000000000000',
      email: action.data.user.email.toLowerCase(),
      lastname: action.data.user.lastname.toLowerCase(),
      name: action.data.user.name.toLowerCase(),
      password: `encoded_${
        action.data.user.password
      }-${action.data.user.email.toLowerCase()}$${action.data.user.document}`,
      phone: action.data.user.phone,
      document: action.data.user.document,
      locale: 'UNITED_STATES_OF_AMERICA',
    });
  });

  it('should throw error if an user field is invalid', async () => {
    const idProvider = new IDProviderStub();
    const hashProvider = new HashProviderStub();
    const repository = new LocalUserRepositoryFactory().createRepository();
    const publisher = new ActionPublisherSpy();

    const action = new CreateUserAction({
      locale: 'UNITED_STATES_OF_AMERICA' as Nationalities,
      user: {
        document: new RandomSSN().value().toString(),
        email: '',
        lastname: faker.name.lastName(),
        name: faker.name.firstName(),
        password: '12345678aX%',
        phone: faker.phone.phoneNumber('##########'),
      },
    });
    const handler = new CreateUserHandler(
      idProvider,
      hashProvider,
      repository,
      publisher,
    );

    const promise = handler.handle(action);

    await expect(promise).rejects.toThrowError(new InvalidEmailError(''));
  });
});

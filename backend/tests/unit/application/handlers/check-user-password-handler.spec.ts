import faker from 'faker';
import { RandomSSN } from 'ssn';

import { LocalUserRepositoryFactory } from '../../../../src/infra/repositories';

import { CheckUserPasswordAction } from '../../../../src/application/actions';
import { CheckUserPasswordHandler } from '../../../../src/application/handlers';

import { AccountDTO } from '../../../../src/domain/dtos';

import {
  HashProviderStub,
  IDProviderStub,
} from '../../../doubles/stubs/providers';

describe('Check User Password', () => {
  it('should return "true" if password matches with hashed password', async () => {
    const document = new RandomSSN().value().toString();
    const account: AccountDTO = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const hashProvider = new HashProviderStub();

    const hashedPassword = await hashProvider.encode(
      account.password,
      `${account.email}$${document}`,
    );

    const action = new CheckUserPasswordAction({
      account,
      document,
      hashedPassword,
    });
    const handler = new CheckUserPasswordHandler(hashProvider);

    const response = await handler.handle(action);

    expect(response).toBeTruthy();
  });

  it('should return "false" if password does not matches with hashed password', async () => {
    const document = new RandomSSN().value().toString();
    const account: AccountDTO = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    const hashedPassword = 'incorrect_hash_password';

    const hashProvider = new HashProviderStub();

    const action = new CheckUserPasswordAction({
      account,
      document,
      hashedPassword,
    });
    const handler = new CheckUserPasswordHandler(hashProvider);

    const response = await handler.handle(action);

    expect(response).toBeFalsy();
  });
});

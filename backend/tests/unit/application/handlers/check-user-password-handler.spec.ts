import faker from 'faker';
import { RandomSSN } from 'ssn';

import { CheckUserPasswordAction } from '../../../../src/application/actions';
import { CheckUserPasswordHandler } from '../../../../src/application/handlers';

import { HashProviderStub } from '../../../doubles/stubs/providers';

describe('Check User Password', () => {
  const makeAccount = (): any => {
    return {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  };

  const makeUserDocument = (): string => {
    return new RandomSSN().value().toString();
  };

  it('should return "true" if password matches with hashed password', async () => {
    const document = makeUserDocument();
    const account = makeAccount();

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
    const sut = new CheckUserPasswordHandler(hashProvider);

    const response = await sut.handle(action);

    expect(response).toBeTruthy();
  });

  it('should return "false" if password does not matches with hashed password', async () => {
    const document = makeUserDocument();
    const account = makeAccount();

    const hashedPassword = 'incorrect_hash_password';
    const hashProvider = new HashProviderStub();

    const action = new CheckUserPasswordAction({
      account,
      document,
      hashedPassword,
    });
    const sut = new CheckUserPasswordHandler(hashProvider);

    const response = await sut.handle(action);

    expect(response).toBeFalsy();
  });
});

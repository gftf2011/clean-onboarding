import faker from 'faker';

import {
  TokenProviderStub,
  IDProviderStub,
} from '../../../doubles/stubs/providers';

import { GetUserSessionAction } from '../../../../src/application/actions';
import { GetUserSessionHandler } from '../../../../src/application/handlers';

describe('Get User Session', () => {
  it('should return session token', async () => {
    const secret = 'secret';
    const userId = faker.datatype.uuid();
    const userEmail = faker.internet.email();

    const idProvider = new IDProviderStub();
    const tokenProvider = new TokenProviderStub();

    const action = new GetUserSessionAction({
      email: userEmail,
      id: userId,
      secret,
    });

    const handler = new GetUserSessionHandler(tokenProvider, idProvider);

    const response = await handler.handle(action);

    expect(response).toBe('fake_token');
  });
});

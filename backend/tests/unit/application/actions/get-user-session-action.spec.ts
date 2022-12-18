import faker from 'faker';

import { GetUserSessionAction } from '../../../../src/application/actions';

describe('Get User Session Action', () => {
  it('should return action', () => {
    const id = faker.datatype.uuid();
    const email = faker.internet.email();
    const secret = faker.lorem.words();

    const input = {
      id,
      email,
      secret,
    };

    const query = new GetUserSessionAction(input);

    expect(query.operation).toBe('get-create-session');
    expect(query.data).toEqual(input);
  });
});

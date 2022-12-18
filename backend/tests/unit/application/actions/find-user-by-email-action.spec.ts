import faker from 'faker';

import { FindUserByEmailAction } from '../../../../src/application/actions';

describe('Find User by Email Action', () => {
  it('should return action', () => {
    const email = faker.internet.email();

    const input = {
      email,
    };

    const query = new FindUserByEmailAction(input);

    expect(query.operation).toBe('find-user-by-email');
    expect(query.data).toEqual(input);
  });
});

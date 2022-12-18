import faker from 'faker';

import { FindUserByEmailAction } from '../../../../src/application/actions';

describe('Find User by Email Action', () => {
  it('should return action', () => {
    const email = faker.internet.email();

    const input = {
      email,
    };

    const action = new FindUserByEmailAction(input);

    expect(action.operation).toBe('find-user-by-email');
    expect(action.data).toEqual(input);
  });
});

import faker from 'faker';

import { FindUserByEmailQuery } from '../../../../src/application/queries';

describe('Find User by Email Query', () => {
  it('should return query', () => {
    const email = faker.internet.email();

    const input = {
      email,
    };

    const query = new FindUserByEmailQuery(input);

    expect(query.operation).toBe('find-user-by-email');
    expect(query.data).toEqual(input);
  });
});

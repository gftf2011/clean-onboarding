import faker from 'faker';

import { FindUserQuery } from '../../../../src/application/queries';

describe('Find User Query', () => {
  it('should return query', () => {
    const id = faker.datatype.uuid();

    const input = {
      id,
    };

    const query = new FindUserQuery(input);

    expect(query.operation).toBe('find-user');
    expect(query.data).toEqual(input);
  });
});

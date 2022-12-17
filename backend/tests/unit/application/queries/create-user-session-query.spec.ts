import faker from 'faker';

import { GetUserSessionQuery } from '../../../../src/application/queries';

describe('Get User Session Query', () => {
  it('should return query', () => {
    const id = faker.datatype.uuid();
    const email = faker.internet.email();
    const secret = faker.lorem.words();

    const input = {
      id,
      email,
      secret,
    };

    const query = new GetUserSessionQuery(input);

    expect(query.operation).toBe('create-session');
    expect(query.data).toEqual(input);
  });
});

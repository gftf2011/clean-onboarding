import faker from 'faker';

import { CreateUserSessionQuery } from '../../../../src/application/queries';

describe('Create User Session Query', () => {
  it('should return query', () => {
    const id = faker.datatype.uuid();
    const email = faker.internet.email();
    const secret = faker.lorem.words();

    const input = {
      id,
      email,
      secret,
    };

    const query = new CreateUserSessionQuery(input);

    expect(query.operation).toBe('create-session');
    expect(query.data).toEqual(input);
  });
});

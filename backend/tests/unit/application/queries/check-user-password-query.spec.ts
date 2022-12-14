import faker from 'faker';
import { RandomSSN } from 'ssn';

import { CheckUserPasswordQuery } from '../../../../src/application/queries';

describe('Check User Password Query', () => {
  it('should return query', () => {
    const document = new RandomSSN().value().toString();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const hashedPassword = faker.datatype.uuid();

    const input = {
      account: {
        email,
        password,
      },
      document,
      hashedPassword,
    };

    const query = new CheckUserPasswordQuery(input);

    expect(query.operation).toBe('check-user-password');
    expect(query.data).toEqual(input);
  });
});

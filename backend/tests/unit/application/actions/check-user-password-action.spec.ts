import faker from 'faker';
import { RandomSSN } from 'ssn';

import { CheckUserPasswordAction } from '../../../../src/application/actions';

describe('Check User Password Action', () => {
  it('should return action', () => {
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

    const action = new CheckUserPasswordAction(input);

    expect(action.operation).toBe('check-user-password');
    expect(action.data).toEqual(input);
  });
});

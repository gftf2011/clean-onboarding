import faker from 'faker';
import { RandomSSN } from 'ssn';

import { CreateUserAction } from '../../../../src/application/actions';

import { Nationalities } from '../../../../src/domain/contracts';

describe('Create User Action', () => {
  it('should return action', () => {
    const email = 'test@mail.com';
    const password = '12345678xX@';
    const name = 'test';
    const lastname = 'test';
    const locale = 'UNITED_STATES_OF_AMERICA' as Nationalities;
    const phone = faker.phone.phoneNumber('##########');
    const document = new RandomSSN().value().toString();

    const input = {
      locale,
      user: {
        email,
        password,
        name,
        lastname,
        phone,
        document,
      },
    };

    const action = new CreateUserAction(input);

    expect(action.operation).toBe('create-user');
    expect(action.data).toEqual(input);
  });
});

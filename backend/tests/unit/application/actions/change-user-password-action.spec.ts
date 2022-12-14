import faker from 'faker';
import { RandomSSN } from 'ssn';

import { ChangeUserPasswordAction } from '../../../../src/application/actions';

import { Nationalities } from '../../../../src/domain/contracts';

describe('Change User Password Action', () => {
  it('should return action', () => {
    const id = faker.datatype.uuid();
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
        id,
        email,
        password,
        name,
        lastname,
        phone,
        document,
      },
    };

    const action = new ChangeUserPasswordAction(input);

    expect(action.operation).toBe('change-user-password');
    expect(action.data).toEqual(input);
  });
});

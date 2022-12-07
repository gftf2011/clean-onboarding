import faker from 'faker';
import { RandomSSN } from 'ssn';

import { CreateUserCommand } from '../../../../src/application/commands';

import { Nationalities } from '../../../../src/domain/contracts';

describe('Create User Command', () => {
  it('should return command', () => {
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

    const command = new CreateUserCommand(input);

    expect(command.operation).toBe('create-user');
    expect(command.data).toEqual(input);
  });
});

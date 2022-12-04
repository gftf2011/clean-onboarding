import { cpf } from 'cpf-cnpj-validator';
import { RandomSSN } from 'ssn';
import faker from 'faker';

import { User } from '../../../../src/domain/entities';
import { Nationalities } from '../../../../src/domain/contracts';
import {
  InvalidIdError,
  InvalidNameError,
} from '../../../../src/domain/errors';

describe('User Entity', () => {
  it('should return "InvalidIdError" if id is invalid', () => {
    const response = User.create(
      '',
      {
        document: new RandomSSN().value().toString(),
        email: faker.internet.email().toLowerCase(),
        lastname: 'test',
        name: 'test',
        password: '12345678aB?',
        phone: '0000000000',
      },
      {
        encrypted: false,
        nationality: Nationalities.UNITED_STATES_OF_AMERICA,
      },
    );
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidIdError(''));
  });

  it('should return "InvalidNameError" if name is invalid', () => {
    const response = User.create(
      '00000000-0000-0000-0000-000000000000',
      {
        document: new RandomSSN().value().toString(),
        email: faker.internet.email().toLowerCase(),
        lastname: 'test',
        name: '',
        password: '12345678aB?',
        phone: '0000000000',
      },
      {
        encrypted: false,
        nationality: Nationalities.UNITED_STATES_OF_AMERICA,
      },
    );
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidNameError(''));
  });
});

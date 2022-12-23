import { RandomSSN } from 'ssn';
import faker from 'faker';

import { User } from '../../../../src/domain/entities';
import { Nationalities } from '../../../../src/domain/contracts';
import {
  InvalidDocumentNumberError,
  InvalidEmailError,
  InvalidIdError,
  InvalidLastnameError,
  InvalidNameError,
  InvalidPasswordError,
  InvalidPhoneError,
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

  it('should return "InvalidLastnameError" if lastname is invalid', () => {
    const response = User.create(
      '00000000-0000-0000-0000-000000000000',
      {
        document: new RandomSSN().value().toString(),
        email: faker.internet.email().toLowerCase(),
        lastname: '',
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
    expect(response.value).toEqual(new InvalidLastnameError(''));
  });

  it('should return "InvalidDocumentNumberError" if document is invalid', () => {
    const response = User.create(
      '00000000-0000-0000-0000-000000000000',
      {
        document: '',
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
    expect(response.value).toEqual(
      new InvalidDocumentNumberError(
        '',
        Nationalities.UNITED_STATES_OF_AMERICA,
      ),
    );
  });

  it('should return "InvalidEmailError" if email is invalid', () => {
    const response = User.create(
      '00000000-0000-0000-0000-000000000000',
      {
        document: new RandomSSN().value().toString(),
        email: '',
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
    expect(response.value).toEqual(new InvalidEmailError(''));
  });

  it('should return "InvalidPasswordError" if password is invalid', () => {
    const response = User.create(
      '00000000-0000-0000-0000-000000000000',
      {
        document: new RandomSSN().value().toString(),
        email: faker.internet.email().toLowerCase(),
        lastname: 'test',
        name: 'test',
        password: '',
        phone: '0000000000',
      },
      {
        encrypted: false,
        nationality: Nationalities.UNITED_STATES_OF_AMERICA,
      },
    );
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidPasswordError());
  });

  it('should return "InvalidPhoneError" if phone is invalid', () => {
    const response = User.create(
      '00000000-0000-0000-0000-000000000000',
      {
        document: new RandomSSN().value().toString(),
        email: faker.internet.email().toLowerCase(),
        lastname: 'test',
        name: 'test',
        password: '12345678aB?',
        phone: '',
      },
      {
        encrypted: false,
        nationality: Nationalities.UNITED_STATES_OF_AMERICA,
      },
    );
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(
      new InvalidPhoneError('', Nationalities.UNITED_STATES_OF_AMERICA),
    );
  });

  it('should return "InvalidPasswordError" if password matches phone number', () => {
    const phone = faker.phone.phoneNumber('##########');
    const response = User.create(
      '00000000-0000-0000-0000-000000000000',
      {
        document: new RandomSSN().value().toString(),
        email: faker.internet.email().toLowerCase(),
        lastname: 'test',
        name: 'test',
        password: `${phone}aB?`,
        phone,
      },
      {
        encrypted: false,
        nationality: Nationalities.UNITED_STATES_OF_AMERICA,
      },
    );
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidPasswordError());
  });

  it('should return "User" with valid parameters', () => {
    const document = new RandomSSN().value().toString();
    const email = faker.internet.email().toLowerCase();

    const response = User.create(
      '00000000-0000-0000-0000-000000000000',
      {
        document,
        email,
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

    const user = (response.value as User).get();

    expect(response.isRight()).toBeTruthy();
    expect(user).toEqual({
      id: '00000000-0000-0000-0000-000000000000',
      document,
      email,
      lastname: 'test',
      name: 'test',
      password: '12345678aB?',
      phone: '0000000000',
      locale: 'UNITED_STATES_OF_AMERICA',
    });
  });
});

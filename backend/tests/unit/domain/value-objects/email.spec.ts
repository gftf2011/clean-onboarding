import { Email } from '../../../../src/domain/value-objects';

import { InvalidEmailError } from '../../../../src/domain/errors';

describe('Email', () => {
  it('should return "InvalidEmailError" if email is "null"', () => {
    const response = Email.create(null as any);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(null as any));
  });

  it('should return "InvalidEmailError" if email is "undefined"', () => {
    const response = Email.create(undefined as any);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(undefined as any));
  });

  it('should return "InvalidEmailError" if email is empty string', () => {
    const response = Email.create('');
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(''));
  });

  it('should return "InvalidEmailError" if email has more than 320 characters', () => {
    const email = 'a'.repeat(321);
    const response = Email.create(email);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should return "InvalidEmailError" if email has invalid pattern', () => {
    let email = 'test.@mail.com';
    let response = Email.create(email);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));

    email = 't..est@mail.com';
    response = Email.create(email);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));

    email = '@mail.com';
    response = Email.create(email);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));

    email = 'test@';
    response = Email.create(email);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));

    email = 'test@mail';
    response = Email.create(email);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));

    email = 'test@mail..com';
    response = Email.create(email);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));

    email = 'test@.mail.com';
    response = Email.create(email);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));

    email = '.test@mail.com';
    response = Email.create(email);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));

    email = 'test@mail.com.';
    response = Email.create(email);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should return "InvalidEmailError" if email domain has more than 255 characters', () => {
    const email = `${'a'.repeat(63)}@${'d'.repeat(127)}.${'d'.repeat(128)}`;
    const response = Email.create(email);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });

  it('should return "InvalidEmailError" if email domain part has more than 127 characters', () => {
    const email = `${'a'.repeat(64)}@${'d'.repeat(128)}.${'d'.repeat(126)}`;
    const response = Email.create(email);

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidEmailError(email));
  });
});

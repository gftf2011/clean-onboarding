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
});

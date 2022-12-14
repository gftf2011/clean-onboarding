import { InvalidPasswordError } from '../../../../src/domain/errors';
import { Password } from '../../../../src/domain/value-objects';

describe('Password', () => {
  describe('No Encryption Password', () => {
    it('should return "InvalidPasswordError" if password is "null"', () => {
      const response = Password.create(null as any, false);
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(new InvalidPasswordError());
    });

    it('should return "InvalidPasswordError" if password is "undefined"', () => {
      const response = Password.create(undefined as any, false);
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(new InvalidPasswordError());
    });

    it('should return "InvalidPasswordError" if password is empty string', () => {
      const response = Password.create('', false);
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(new InvalidPasswordError());
    });

    it('should return "InvalidPasswordError" if password has less than 11 characters', () => {
      const response = Password.create('aaaaaaaaaa', false);
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(new InvalidPasswordError());
    });

    it('should return "InvalidPasswordError" if password has more than 24 characters', () => {
      const response = Password.create('a'.repeat(25), false);
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(new InvalidPasswordError());
    });

    it('should return "InvalidPasswordError" if password has any empty space', () => {
      const response = Password.create('aaaaaa aaaa', false);
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(new InvalidPasswordError());
    });

    it('should return "InvalidPasswordError" if password has less than 8 numeric values', () => {
      const response = Password.create('1234567aaaa', false);
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(new InvalidPasswordError());
    });

    it('should return "InvalidPasswordError" if password has less than 1 uppercase letter', () => {
      const response = Password.create('12345678aaa', false);
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(new InvalidPasswordError());
    });

    it('should return "InvalidPasswordError" if password has less than 1 lowercase letter', () => {
      const response = Password.create('12345678AAA', false);
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(new InvalidPasswordError());
    });

    it('should return "InvalidPasswordError" if password has less than 1 special character - (^!@#$%&?)', () => {
      const response = Password.create('12345678aaA', false);
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(new InvalidPasswordError());
    });

    it('should return valid "Password" with valid parameter', () => {
      const value = '12345678a?B';
      const response = Password.create(value, false);
      const password = response.value as Password;

      expect(response.isRight()).toBeTruthy();
      expect(password.get()).toBe(value);
    });
  });

  describe('Encrypted Password', () => {
    it('should return "InvalidPasswordError" if password is "null"', () => {
      const response = Password.create(null as any, true);
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(new InvalidPasswordError());
    });

    it('should return "InvalidPasswordError" if password is "undefined"', () => {
      const response = Password.create(undefined as any, true);
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(new InvalidPasswordError());
    });

    it('should return "InvalidPasswordError" if password is empty string', () => {
      const response = Password.create('', true);
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(new InvalidPasswordError());
    });

    it('should return "InvalidPasswordError" if password has less than 25 characters', () => {
      const response = Password.create('a'.repeat(24), true);
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(new InvalidPasswordError());
    });

    it('should return valid "Password" with valid parameter', () => {
      const value = 'a'.repeat(25);
      const response = Password.create(value, true);
      const password = response.value as Password;

      expect(response.isRight()).toBeTruthy();
      expect(password.get()).toBe(value);
    });
  });
});

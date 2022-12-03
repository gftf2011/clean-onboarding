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
  });
});

import { InvalidPhoneError } from '../../../../src/domain/errors';
import { Phone } from '../../../../src/domain/value-objects/phone';
import { Nationalities } from '../../../../src/domain/contracts';

describe('Phone Number', () => {
  describe('Brazilian phone number', () => {
    it('should return "InvalidPhoneError" if phone number is "null"', () => {
      const response = Phone.create(null as any, Nationalities.BRAZIL);
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidPhoneError(null as any, Nationalities.BRAZIL as string),
      );
    });
  });
});

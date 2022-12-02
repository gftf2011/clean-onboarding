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

    it('should return "InvalidPhoneError" if phone number is "undefined"', () => {
      const response = Phone.create(undefined as any, Nationalities.BRAZIL);
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidPhoneError(undefined as any, Nationalities.BRAZIL as string),
      );
    });

    it('should return "InvalidPhoneError" if phone number is empty string', () => {
      const response = Phone.create('', Nationalities.BRAZIL);
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidPhoneError('', Nationalities.BRAZIL as string),
      );
    });

    it('should return "InvalidPhoneError" if phone number do not have 11 characters', () => {
      const response = Phone.create('0000000000', Nationalities.BRAZIL);
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidPhoneError('0000000000', Nationalities.BRAZIL as string),
      );
    });

    it('should return "InvalidPhoneError" if phone number do not have 11 characters', () => {
      const response = Phone.create('0000000000', Nationalities.BRAZIL);
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidPhoneError('0000000000', Nationalities.BRAZIL as string),
      );
    });

    it('should return "InvalidPhoneError" if phone number has any letter', () => {
      const response = Phone.create('0090000000a', Nationalities.BRAZIL);
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidPhoneError('0090000000a', Nationalities.BRAZIL as string),
      );
    });

    it('should return valid "Phone" with valid parameter', () => {
      const phoneNumber = '00900000000';
      const response = Phone.create(phoneNumber, Nationalities.BRAZIL);
      const phone = response.value as Phone;

      expect(response.isRight()).toBeTruthy();
      expect(phone.get()).toBe(phoneNumber);
      expect(phone.format()).toBe(
        phoneNumber.replace(/^(\d{2})(9\d{4})(\d{4})$/g, '$1 $2-$3'),
      );
      expect(phone.formatWithDDI()).toBe(
        `+55${phoneNumber}`.replace(
          /^(\+\d{2})(\d{2})(9\d{4})(\d{4})$/g,
          '$1 $2 $3-$4',
        ),
      );
    });
  });
});

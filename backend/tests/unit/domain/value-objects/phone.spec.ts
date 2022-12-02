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
      let response = Phone.create('0000000000', Nationalities.BRAZIL);
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidPhoneError('0000000000', Nationalities.BRAZIL as string),
      );

      response = Phone.create('000000000000', Nationalities.BRAZIL);
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidPhoneError('000000000000', Nationalities.BRAZIL as string),
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
      expect(phone.get()).toBe('00900000000');
      expect(phone.format()).toBe('00 90000-0000');
      expect(phone.formatWithDDI()).toBe('+55 00 90000-0000');
    });

    it('should return valid "Phone" with formatted parameter', () => {
      const phoneNumber = '(00) 90000-0000';
      const response = Phone.create(phoneNumber, Nationalities.BRAZIL);
      const phone = response.value as Phone;

      expect(response.isRight()).toBeTruthy();
      expect(phone.get()).toBe('00900000000');
      expect(phone.format()).toBe('00 90000-0000');
      expect(phone.formatWithDDI()).toBe('+55 00 90000-0000');
    });
  });

  describe('American phone number', () => {
    it('should return "InvalidPhoneError" if phone number is "null"', () => {
      const response = Phone.create(
        null as any,
        Nationalities.UNITED_STATES_OF_AMERICA,
      );
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidPhoneError(
          null as any,
          Nationalities.UNITED_STATES_OF_AMERICA as string,
        ),
      );
    });

    it('should return "InvalidPhoneError" if phone number is "undefined"', () => {
      const response = Phone.create(
        undefined as any,
        Nationalities.UNITED_STATES_OF_AMERICA,
      );
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidPhoneError(
          undefined as any,
          Nationalities.UNITED_STATES_OF_AMERICA as string,
        ),
      );
    });

    it('should return "InvalidPhoneError" if phone number is empty string', () => {
      const response = Phone.create('', Nationalities.UNITED_STATES_OF_AMERICA);
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidPhoneError(
          '',
          Nationalities.UNITED_STATES_OF_AMERICA as string,
        ),
      );
    });

    it('should return "InvalidPhoneError" if phone number do not have 10 characters', () => {
      let response = Phone.create(
        '000000000',
        Nationalities.UNITED_STATES_OF_AMERICA,
      );
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidPhoneError(
          '000000000',
          Nationalities.UNITED_STATES_OF_AMERICA as string,
        ),
      );

      response = Phone.create(
        '00000000000',
        Nationalities.UNITED_STATES_OF_AMERICA,
      );
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidPhoneError(
          '00000000000',
          Nationalities.UNITED_STATES_OF_AMERICA as string,
        ),
      );
    });

    it('should return "InvalidPhoneError" if phone number has any letter', () => {
      const response = Phone.create(
        '000000000a',
        Nationalities.UNITED_STATES_OF_AMERICA,
      );
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidPhoneError(
          '000000000a',
          Nationalities.UNITED_STATES_OF_AMERICA as string,
        ),
      );
    });
  });
});

import { cpf } from 'cpf-cnpj-validator';
import { RandomSSN } from 'ssn';
import faker from 'faker';

import { InvalidDocumentNumberError } from '../../../../src/domain/errors';
import { Document } from '../../../../src/domain/value-objects/document';
import { Nationalities } from '../../../../src/domain/contracts';

describe('Document Number', () => {
  describe('Brazilian document - CPF', () => {
    it('should return "InvalidDocumentNumberError" if document number is "null"', () => {
      const response = Document.create(null as any, Nationalities.BRAZIL);
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidDocumentNumberError(
          null as any,
          Nationalities.BRAZIL as string,
        ),
      );
    });

    it('should return "InvalidDocumentNumberError" if document number is "undefined"', () => {
      const response = Document.create(undefined as any, Nationalities.BRAZIL);
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidDocumentNumberError(
          undefined as any,
          Nationalities.BRAZIL as string,
        ),
      );
    });

    it('should return "InvalidDocumentNumberError" if document number is empty string', () => {
      const response = Document.create('', Nationalities.BRAZIL);
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidDocumentNumberError('', Nationalities.BRAZIL as string),
      );
    });

    it('should return "InvalidDocumentNumberError" if document number do not have 11 numerical characters', () => {
      const response = Document.create('1111111111', Nationalities.BRAZIL);
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidDocumentNumberError(
          '1111111111',
          Nationalities.BRAZIL as string,
        ),
      );
    });

    it('should return "InvalidDocumentNumberError" if document number has letters', () => {
      const response = Document.create('1111111111a', Nationalities.BRAZIL);
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidDocumentNumberError(
          '1111111111a',
          Nationalities.BRAZIL as string,
        ),
      );
    });

    it('should return "InvalidDocumentNumberError" if document number has wrong first validation digits', () => {
      const response = Document.create('11111111121', Nationalities.BRAZIL);
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidDocumentNumberError(
          '11111111121',
          Nationalities.BRAZIL as string,
        ),
      );
    });

    it('should return "InvalidDocumentNumberError" if document number has wrong second validation digits', () => {
      const response = Document.create('11111111112', Nationalities.BRAZIL);
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidDocumentNumberError(
          '11111111112',
          Nationalities.BRAZIL as string,
        ),
      );
    });

    it('should return valid "Document" with valid parameter', () => {
      const documentNumber = cpf.generate();
      const response = Document.create(documentNumber, Nationalities.BRAZIL);
      const document = response.value as Document;

      expect(response.isRight()).toBeTruthy();
      expect(document.get()).toBe(documentNumber);
      expect(document.format()).toBe(
        documentNumber.replace(
          /^(\d{3})(\d{3})(\d{3})(\d{2})$/g,
          '$1.$2.$3-$4',
        ),
      );
    });

    it('should return valid "Document" with valid formatted parameter', () => {
      const documentNumber = cpf.generate(true);
      const response = Document.create(documentNumber, Nationalities.BRAZIL);
      const document = response.value as Document;

      expect(response.isRight()).toBeTruthy();
      expect(document.get()).toBe(documentNumber.replace(/\D/g, ''));
      expect(document.format()).toBe(documentNumber);
    });
  });

  describe('American document - SSN', () => {
    it('should return "InvalidDocumentNumberError" if document number is "null"', () => {
      const response = Document.create(
        null as any,
        Nationalities.UNITED_STATES_OF_AMERICA,
      );
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidDocumentNumberError(
          null as any,
          Nationalities.UNITED_STATES_OF_AMERICA as string,
        ),
      );
    });

    it('should return "InvalidDocumentNumberError" if document number is "undefined"', () => {
      const response = Document.create(
        undefined as any,
        Nationalities.UNITED_STATES_OF_AMERICA,
      );
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidDocumentNumberError(
          undefined as any,
          Nationalities.UNITED_STATES_OF_AMERICA as string,
        ),
      );
    });

    it('should return "InvalidDocumentNumberError" if document number is empty string', () => {
      const response = Document.create(
        '',
        Nationalities.UNITED_STATES_OF_AMERICA,
      );
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidDocumentNumberError(
          '',
          Nationalities.UNITED_STATES_OF_AMERICA as string,
        ),
      );
    });

    it('should return "InvalidDocumentNumberError" if document number do not have 9 numerical characters', () => {
      const response = Document.create(
        '00000000',
        Nationalities.UNITED_STATES_OF_AMERICA,
      );
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidDocumentNumberError(
          '00000000',
          Nationalities.UNITED_STATES_OF_AMERICA as string,
        ),
      );
    });

    it('should return "InvalidDocumentNumberError" if document number has letters', () => {
      const response = Document.create(
        '00000000a',
        Nationalities.UNITED_STATES_OF_AMERICA,
      );
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidDocumentNumberError(
          '00000000a',
          Nationalities.UNITED_STATES_OF_AMERICA as string,
        ),
      );
    });

    it('should return "InvalidDocumentNumberError" if document number first group matches "000"', () => {
      const response = Document.create(
        '000000000',
        Nationalities.UNITED_STATES_OF_AMERICA,
      );
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidDocumentNumberError(
          '000000000',
          Nationalities.UNITED_STATES_OF_AMERICA as string,
        ),
      );
    });

    it('should return "InvalidDocumentNumberError" if document number first group matches "666" - THE NUMBER OF THE BEAST', () => {
      const response = Document.create(
        '666000000',
        Nationalities.UNITED_STATES_OF_AMERICA,
      );
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidDocumentNumberError(
          '666000000',
          Nationalities.UNITED_STATES_OF_AMERICA as string,
        ),
      );
    });

    it('should return "InvalidDocumentNumberError" if document number first group is greater than or equal 900 and less than or equal 999', () => {
      const firstGroupNumber = faker.datatype.number({ min: 900, max: 999 });
      const response = Document.create(
        `${firstGroupNumber}000000`,
        Nationalities.UNITED_STATES_OF_AMERICA,
      );
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidDocumentNumberError(
          `${firstGroupNumber}000000`,
          Nationalities.UNITED_STATES_OF_AMERICA as string,
        ),
      );
    });

    it('should return "InvalidDocumentNumberError" if document number second group matches "00"', () => {
      const response = Document.create(
        `800000000`,
        Nationalities.UNITED_STATES_OF_AMERICA,
      );
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidDocumentNumberError(
          `800000000`,
          Nationalities.UNITED_STATES_OF_AMERICA as string,
        ),
      );
    });

    it('should return "InvalidDocumentNumberError" if document number third group matches "0000"', () => {
      const response = Document.create(
        `800010000`,
        Nationalities.UNITED_STATES_OF_AMERICA,
      );
      expect(response.isLeft()).toBeTruthy();
      expect(response.value).toEqual(
        new InvalidDocumentNumberError(
          `800010000`,
          Nationalities.UNITED_STATES_OF_AMERICA as string,
        ),
      );
    });

    it('should return valid "Document" with valid parameter', () => {
      const ssn = new RandomSSN().value();

      const response = Document.create(
        ssn.toString(),
        Nationalities.UNITED_STATES_OF_AMERICA,
      );

      const document = response.value as Document;

      expect(response.isRight()).toBeTruthy();
      expect(document.get()).toBe(ssn.toString());
      expect(document.format()).toBe(ssn.toFormattedString());
    });

    it('should return valid "Document" with valid parameter', () => {
      const ssn = new RandomSSN().value();

      const response = Document.create(
        ssn.toFormattedString(),
        Nationalities.UNITED_STATES_OF_AMERICA,
      );

      const document = response.value as Document;

      expect(response.isRight()).toBeTruthy();
      expect(document.get()).toBe(ssn.toString());
      expect(document.format()).toBe(ssn.toFormattedString());
    });
  });
});

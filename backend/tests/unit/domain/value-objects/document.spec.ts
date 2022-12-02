import { cpf } from 'cpf-cnpj-validator';

import { InvalidDocumentNumberError } from '../../../../src/domain/errors';
import { Document } from '../../../../src/domain/value-objects/document';
import { Nationalities } from '../../../../src/domain/contracts';

describe('Document Number - Brazilian', () => {
  it('should return "InvalidDocumentNumberError" if document number is "null"', () => {
    const response = Document.create(null as any);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(
      new InvalidDocumentNumberError(
        null as any,
        Nationalities.BRAZIL as string,
      ),
    );
  });

  it('should return "InvalidDocumentNumberError" if document number is "undefined"', () => {
    const response = Document.create(undefined as any);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(
      new InvalidDocumentNumberError(
        undefined as any,
        Nationalities.BRAZIL as string,
      ),
    );
  });

  it('should return "InvalidDocumentNumberError" if document number is empty string', () => {
    const response = Document.create('');
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(
      new InvalidDocumentNumberError('', Nationalities.BRAZIL as string),
    );
  });

  it('should return "InvalidDocumentNumberError" if document number is not complete', () => {
    const response = Document.create('1111111111');
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(
      new InvalidDocumentNumberError(
        '1111111111',
        Nationalities.BRAZIL as string,
      ),
    );
  });

  it('should return "InvalidDocumentNumberError" if document number has letters', () => {
    const response = Document.create('1111111111a');
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(
      new InvalidDocumentNumberError(
        '1111111111a',
        Nationalities.BRAZIL as string,
      ),
    );
  });

  it('should return "InvalidDocumentNumberError" if document number has wrong validation digits', () => {
    const response = Document.create('15004555045');
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(
      new InvalidDocumentNumberError(
        '15004555045',
        Nationalities.BRAZIL as string,
      ),
    );
  });

  it('should return valid "Document" with valid parameter', () => {
    const documentNumber = cpf.generate();
    const response = Document.create(documentNumber);
    const document = response.value as Document;

    expect(response.isRight()).toBeTruthy();
    expect(document.get()).toBe(documentNumber);
    expect(document.format()).toBe(
      documentNumber.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/g, '$1.$2.$3-$4'),
    );
  });

  it('should return valid "Document" with valid parameter when BRAZILIAN nationality is passed', () => {
    const documentNumber = cpf.generate();
    const response = Document.create(documentNumber, Nationalities.BRAZIL);
    const document = response.value as Document;

    expect(response.isRight()).toBeTruthy();
    expect(document.get()).toBe(documentNumber);
    expect(document.format()).toBe(
      documentNumber.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/g, '$1.$2.$3-$4'),
    );
  });
});

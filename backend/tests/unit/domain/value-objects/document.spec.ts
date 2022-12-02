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
});

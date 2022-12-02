/* eslint-disable max-classes-per-file */
import { DocumentCreator, IDocument } from '../../../contracts';

export class AmericanDocument implements IDocument {
  public format(documentNumber: string): string {
    return documentNumber.replace(/^(\d{3})(\d{2})(\d{4})$/g, '$1-$2-$3');
  }

  public clean(documentNumber: string): string {
    return documentNumber.replace(/[-]/g, '');
  }

  private static isDocumentFirstGroupValid(documentNumber: string): boolean {
    const DOCUMENT_ONLY_NUMBERS_REGEX = /^(\d{3})(\d{2})(\d{4})$/g;

    const groups = DOCUMENT_ONLY_NUMBERS_REGEX.exec(documentNumber);

    const value = groups[1];

    if (
      value === '000' ||
      value === '666' ||
      (Number(value) >= 900 && Number(value) <= 999)
    ) {
      return false;
    }

    return true;
  }

  private static isDocumentSecondGroupValid(documentNumber: string): boolean {
    const DOCUMENT_ONLY_NUMBERS_REGEX = /^(\d{3})(\d{2})(\d{4})$/g;

    const groups = DOCUMENT_ONLY_NUMBERS_REGEX.exec(documentNumber);

    const value = groups[2];

    if (value === '00') {
      return false;
    }

    return true;
  }

  private static isDocumentThirdGroupValid(documentNumber: string): boolean {
    const DOCUMENT_ONLY_NUMBERS_REGEX = /^(\d{3})(\d{2})(\d{4})$/g;

    const groups = DOCUMENT_ONLY_NUMBERS_REGEX.exec(documentNumber);

    const value = groups[3];

    if (value === '0000') {
      return false;
    }

    return true;
  }

  private static hasDocumentCorrectLength(documentNumber: string): boolean {
    return documentNumber.length === 9;
  }

  private static hasDocumentOnlyDigits(taxvat: string): boolean {
    const DOCUMENT_ONLY_NUMBERS_REGEX = /^(\d{3})(\d{2})(\d{4})$/g;

    return DOCUMENT_ONLY_NUMBERS_REGEX.test(taxvat);
  }

  public validate(documentNumber: string): boolean {
    if (!AmericanDocument.hasDocumentCorrectLength(documentNumber)) {
      return false;
    }

    if (!AmericanDocument.hasDocumentOnlyDigits(documentNumber)) {
      return false;
    }

    if (
      !AmericanDocument.isDocumentFirstGroupValid(documentNumber) ||
      !AmericanDocument.isDocumentSecondGroupValid(documentNumber) ||
      !AmericanDocument.isDocumentThirdGroupValid(documentNumber)
    ) {
      return false;
    }

    return true;
  }
}

export class AmericanDocumentCreator extends DocumentCreator {
  protected factoryMethod(): IDocument {
    return new AmericanDocument();
  }
}

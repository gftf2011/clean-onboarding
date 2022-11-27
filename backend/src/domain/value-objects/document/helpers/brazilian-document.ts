/* eslint-disable max-classes-per-file */
import { DocumentCreator, IDocument } from '../../../contracts';

export class BrazilianDocument implements IDocument {
  public format(documentNumber: string): string {
    return documentNumber.replace(
      /^(\d{3})(\d{3})(\d{3})(\d{2})$/g,
      '$1.$2.$3-$4',
    );
  }

  public clean(documentNumber: string): string {
    return documentNumber.replace(/\D/g, '');
  }

  private static isDocumentFirstDigitValid(documentNumber: string): boolean {
    const DOCUMENT_ONLY_NUMBERS_REGEX = /^(\d{3})(\d{3})(\d{3})(\d{2})$/g;

    const groups = DOCUMENT_ONLY_NUMBERS_REGEX.exec(documentNumber);

    const value1 = groups[1];
    const value2 = groups[2];
    const value3 = groups[3];
    const validationDigits = groups[4];

    const num1: number = 10 * +String(value1).charAt(0);
    const num2: number = 9 * +String(value1).charAt(1);
    const num3: number = 8 * +String(value1).charAt(2);

    const num4: number = 7 * +String(value2).charAt(0);
    const num5: number = 6 * +String(value2).charAt(1);
    const num6: number = 5 * +String(value2).charAt(2);

    const num7: number = 4 * +String(value3).charAt(0);
    const num8: number = 3 * +String(value3).charAt(1);
    const num9: number = 2 * +String(value3).charAt(2);

    const result =
      ((num1 + num2 + num3 + num4 + num5 + num6 + num7 + num8 + num9) * 10) %
      11;

    let resultString = String(result);
    resultString = resultString.charAt(resultString.length - 1);

    return +String(validationDigits).charAt(0) === +resultString;
  }

  private static isDocumentSecondDigitValid(documentNumber: string): boolean {
    const DOCUMENT_ONLY_NUMBERS_REGEX = /^(\d{3})(\d{3})(\d{3})(\d{2})$/g;

    const groups = DOCUMENT_ONLY_NUMBERS_REGEX.exec(documentNumber);

    const value1 = groups[1];
    const value2 = groups[2];
    const value3 = groups[3];
    const validationDigits = groups[4];

    const num1: number = 11 * +String(value1).charAt(0);
    const num2: number = 10 * +String(value1).charAt(1);
    const num3: number = 9 * +String(value1).charAt(2);

    const num4: number = 8 * +String(value2).charAt(0);
    const num5: number = 7 * +String(value2).charAt(1);
    const num6: number = 6 * +String(value2).charAt(2);

    const num7: number = 5 * +String(value3).charAt(0);
    const num8: number = 4 * +String(value3).charAt(1);
    const num9: number = 3 * +String(value3).charAt(2);

    const num10: number = 2 * +String(validationDigits).charAt(0);

    const result =
      ((num1 + num2 + num3 + num4 + num5 + num6 + num7 + num8 + num9 + num10) *
        10) %
      11;

    let resultString = String(result);
    resultString = resultString.charAt(resultString.length - 1);

    return +String(validationDigits).charAt(1) === +resultString;
  }

  private static hasDocumentCorrectLength(documentNumber: string): boolean {
    return documentNumber.length === 11;
  }

  private static hasDocumentOnlyDigits(taxvat: string): boolean {
    const DOCUMENT_ONLY_NUMBERS_REGEX = /^(\d{3})(\d{3})(\d{3})(\d{2})$/g;

    return DOCUMENT_ONLY_NUMBERS_REGEX.test(taxvat);
  }

  public validate(documentNumber: string): boolean {
    if (!BrazilianDocument.hasDocumentCorrectLength(documentNumber)) {
      return false;
    }

    if (!BrazilianDocument.hasDocumentOnlyDigits(documentNumber)) {
      return false;
    }

    if (
      !BrazilianDocument.isDocumentFirstDigitValid(documentNumber) ||
      !BrazilianDocument.isDocumentSecondDigitValid(documentNumber)
    ) {
      return false;
    }

    return true;
  }
}

export class BrazilianDocumentCreator extends DocumentCreator {
  protected factoryMethod(): IDocument {
    return new BrazilianDocument();
  }
}

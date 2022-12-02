import { Either, left, right } from '../../../shared';

import { InvalidDocumentNumberError } from '../../errors';
import { Nationalities, DocumentCreator } from '../../contracts';
import { AmericanDocumentCreator, BrazilianDocumentCreator } from './helpers';

export class Document {
  private constructor(
    private readonly value: string,
    private readonly nationality: Nationalities,
  ) {
    Object.freeze(this);
  }

  private static selectDocument(nationality: Nationalities): DocumentCreator {
    if (nationality === Nationalities.UNITED_STATES_OF_AMERICA) {
      return new AmericanDocumentCreator();
    }
    return new BrazilianDocumentCreator();
  }

  public get(): string {
    const document = Document.selectDocument(this.nationality);
    return document.clean(this.value);
  }

  public format(): string {
    const document = Document.selectDocument(this.nationality);
    return document.format(this.value);
  }

  public static create(
    documentNumber: string,
    nationality: Nationalities,
  ): Either<Error, Document> {
    const document = Document.selectDocument(nationality);

    if (!documentNumber || !document.validate(document.clean(documentNumber))) {
      return left(
        new InvalidDocumentNumberError(documentNumber, nationality as string),
      );
    }

    return right(new Document(document.clean(documentNumber), nationality));
  }
}

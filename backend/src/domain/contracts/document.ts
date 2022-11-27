export interface IDocument {
  format: (documentNumber: string) => string;
  clean: (documentNumber: string) => string;
  validate: (documentNumber: string) => boolean;
}

export abstract class DocumentCreator implements IDocument {
  protected abstract factoryMethod(): IDocument;

  public format(documentNumber: string): string {
    const product = this.factoryMethod();
    return product.format(documentNumber);
  }

  public clean(documentNumber: string): string {
    const product = this.factoryMethod();
    return product.clean(documentNumber);
  }

  public validate(documentNumber: string): boolean {
    const product = this.factoryMethod();
    return product.validate(documentNumber);
  }
}

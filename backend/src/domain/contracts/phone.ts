export interface IPhone {
  format: (documentNumber: string) => string;
  formatWithDDI: (documentNumber: string) => string;
  clean: (documentNumber: string) => string;
  validate: (documentNumber: string) => boolean;
}

export abstract class PhoneCreator implements IPhone {
  protected abstract factoryMethod(): IPhone;

  public format(documentNumber: string): string {
    const product = this.factoryMethod();
    return product.format(documentNumber);
  }

  public formatWithDDI(documentNumber: string): string {
    const product = this.factoryMethod();
    return product.formatWithDDI(documentNumber);
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

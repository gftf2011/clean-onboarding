/* eslint-disable max-classes-per-file */
import { PhoneCreator, IPhone } from '../../../contracts';

export class BrazilianPhone implements IPhone {
  private readonly DDI: string = '+55';

  public clean(phoneNumber: string): string {
    return phoneNumber.replace(/[()\-\s]/g, '');
  }

  public format(phoneNumber: string): string {
    return phoneNumber.replace(/^(\d{2})(9\d{4})(\d{4})$/g, '$1 $2-$3');
  }

  public formatWithDDI(phoneNumber: string): string {
    const phoneWithDDI = `${this.DDI}${phoneNumber}`;
    return phoneWithDDI.replace(
      /^(\+\d{2})(\d{2})(9\d{4})(\d{4})$/g,
      '$1 $2 $3-$4',
    );
  }

  private static isPhoneValid(phoneNumber: string): boolean {
    const regex = /^(\d{2})(9\d{4})(\d{4})$/g;

    return regex.test(phoneNumber);
  }

  private static hasCorrectLenght(phoneNumber: string): boolean {
    return phoneNumber.length === 11;
  }

  public validate(phoneNumber: string): boolean {
    if (!BrazilianPhone.hasCorrectLenght(phoneNumber)) {
      return false;
    }

    if (!BrazilianPhone.isPhoneValid(phoneNumber)) {
      return false;
    }

    return true;
  }
}

export class BrazilianPhoneCreator extends PhoneCreator {
  protected factoryMethod(): IPhone {
    return new BrazilianPhone();
  }
}

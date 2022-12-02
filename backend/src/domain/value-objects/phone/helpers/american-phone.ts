/* eslint-disable max-classes-per-file */
import { PhoneCreator, IPhone } from '../../../contracts';

export class AmericanPhone implements IPhone {
  private readonly DDI: string = '+1';

  public clean(phoneNumber: string): string {
    return phoneNumber.replace(/[()\-\s]/g, '');
  }

  public format(phoneNumber: string): string {
    return phoneNumber.replace(/^(\d{3})(\d{3})(\d{4})$/g, '$1 $2-$3');
  }

  public formatWithDDI(phoneNumber: string): string {
    const phoneWithDDI = `${this.DDI}${phoneNumber}`;
    return phoneWithDDI.replace(
      /^(\+\d{1})(\d{3})(\d{3})(\d{4})$/g,
      '$1 $2 $3-$4',
    );
  }

  private static isPhoneValid(phoneNumber: string): boolean {
    const regex = /^(\d{3})(\d{3})(\d{4})$/g;

    return regex.test(phoneNumber);
  }

  private static hasCorrectLenght(phoneNumber: string): boolean {
    return phoneNumber.length === 10;
  }

  public validate(phoneNumber: string): boolean {
    if (!AmericanPhone.hasCorrectLenght(phoneNumber)) {
      return false;
    }

    if (!AmericanPhone.isPhoneValid(phoneNumber)) {
      return false;
    }

    return true;
  }
}

export class AmericanPhoneCreator extends PhoneCreator {
  protected factoryMethod(): IPhone {
    return new AmericanPhone();
  }
}

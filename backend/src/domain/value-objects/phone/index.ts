import { Either, left, right } from '../../../shared';

import { InvalidPhoneError } from '../../errors';
import { Nationalities, PhoneCreator } from '../../contracts';
import { AmericanPhoneCreator, BrazilianPhoneCreator } from './helpers';

export class Phone {
  private constructor(
    private readonly value: string,
    private readonly nationality: Nationalities,
  ) {
    Object.freeze(this);
  }

  private static selectPhone(nationality: Nationalities): PhoneCreator {
    if (nationality === Nationalities.UNITED_STATES_OF_AMERICA) {
      return new AmericanPhoneCreator();
    }
    return new BrazilianPhoneCreator();
  }

  public get(): string {
    const phone = Phone.selectPhone(this.nationality);
    return phone.clean(this.value);
  }

  public format(): string {
    const phone = Phone.selectPhone(this.nationality);
    return phone.format(this.value);
  }

  public formatWithDDI(): string {
    const phone = Phone.selectPhone(this.nationality);
    return phone.formatWithDDI(this.value);
  }

  public static create(
    phoneNumber: string,
    nationality: Nationalities,
  ): Either<Error, Phone> {
    const phone = Phone.selectPhone(nationality);

    if (!phoneNumber || !phone.validate(phone.clean(phoneNumber))) {
      return left(new InvalidPhoneError(phoneNumber, nationality as string));
    }

    return right(new Phone(phone.clean(phoneNumber), nationality));
  }
}

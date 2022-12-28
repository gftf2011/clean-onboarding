import faker from 'faker';

import { Password, Phone } from '../../../../src/domain/value-objects';
import { PasswordRestrictionService } from '../../../../src/domain/services';
import { Nationalities } from '../../../../src/domain/contracts';

describe('Password Restriction Domain Service', () => {
  it('should return "true" if phone number matches with password value', () => {
    const phoneValue = faker.phone.phoneNumber('9999999999');
    const passwordValue = '9999999999aF$';

    const phone = Phone.create(
      phoneValue,
      Nationalities.UNITED_STATES_OF_AMERICA,
    );
    const password = Password.create(passwordValue, false);

    const sut = new PasswordRestrictionService();

    const response = sut.phoneMatchesPassword(
      password.value as Password,
      phone.value as Phone,
    );

    expect(response).toBeTruthy();
  });

  it('should return "false" if phone number does not matches with password value', () => {
    const phoneValue = faker.phone.phoneNumber('0000000000');
    const passwordValue = '9999999999aF$';

    const phone = Phone.create(
      phoneValue,
      Nationalities.UNITED_STATES_OF_AMERICA,
    );
    const password = Password.create(passwordValue, false);

    const sut = new PasswordRestrictionService();

    const response = sut.phoneMatchesPassword(
      password.value as Password,
      phone.value as Phone,
    );

    expect(response).toBeFalsy();
  });
});

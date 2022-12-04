import { Password, Phone } from '../value-objects';

export class PasswordRestrictionService {
  public phoneMatchesPassword(password: Password, phone: Phone): boolean {
    return !!password.get().match(phone.get());
  }
}

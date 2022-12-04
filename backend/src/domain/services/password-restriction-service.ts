import { Password, Phone } from '../value-objects';

export class PasswordRestrictionService {
  public phoneMatchesPassword(password: Password, phone: Phone): boolean {
    if (password.get().length < phone.get().length) {
      return false;
    }
    return !!password.get().match(phone.get());
  }
}

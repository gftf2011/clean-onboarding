import faker from 'faker';

import { SendWelcomeEmailAction } from '../../../../src/application/actions';

describe('Send Welcome Email Action', () => {
  it('should return action', () => {
    const fullName = `${faker.name.firstName()} ${faker.name.lastName()}`;
    const email = faker.internet.email();

    const input = {
      fullName,
      to: email,
    };

    const action = new SendWelcomeEmailAction(input);

    expect(action.operation).toBe('send-welcome-email');
    expect(action.data).toEqual(input);
  });
});

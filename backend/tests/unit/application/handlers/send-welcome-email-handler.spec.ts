import faker from 'faker';

import { SendWelcomeEmailAction } from '../../../../src/application/actions';
import { SendWelcomeEmailHandler } from '../../../../src/application/handlers';

import { EmailProviderSpy } from '../../../doubles/spies/providers';

describe('Send Welcome Email', () => {
  it('should send welcome email', async () => {
    const emailProvider = new EmailProviderSpy();
    const handler = new SendWelcomeEmailHandler(emailProvider);
    const action = new SendWelcomeEmailAction({
      fullName: `${faker.name.firstName()} ${faker.name.lastName()}`,
      to: faker.internet.email(),
    });

    await handler.handle(action);

    expect(emailProvider.calls).toBe(1);
  });
});

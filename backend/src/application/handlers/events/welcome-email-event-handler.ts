import path from 'path';

import { WelcomeEmailEvent } from '../../events';
import { IEventHandler } from '../../contracts/handlers';
import { IEmailProvider } from '../../contracts/providers';

export class WelcomeEmailEventHandler implements IEventHandler {
  readonly operation: string = 'welcome-email';

  constructor(private readonly email: IEmailProvider) {}

  public async handle(event: WelcomeEmailEvent): Promise<void> {
    const welcomeTemplatePath = path.resolve(
      __dirname,
      '..',
      '..',
      'views',
      'layouts',
      'welcome.hbs',
    );

    await this.email.send(
      {
        from: 'Gabriel Ferraz | Platform <platform.team@gmail.com>',
        to: event.data.to,
        subject: '[Platform Team] Welcome to Platform',
      },
      {
        path: welcomeTemplatePath,
        data: {
          title: 'Welcome',
          user_full_name: event.data.fullName,
        },
      },
    );
  }
}

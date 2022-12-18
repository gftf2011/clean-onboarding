import path from 'path';

import { SendWelcomeEmailAction } from '../actions';
import { Handler } from '../contracts/handlers';
import { EmailProvider } from '../contracts/providers';

export class SendWelcomeEmailHandler implements Handler {
  readonly operation: string = 'send-welcome-email';

  constructor(private readonly email: EmailProvider) {}

  private resolveFilePath(): string {
    return path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'views',
      'layouts',
      'welcome.hbs',
    );
  }

  public async handle(action: SendWelcomeEmailAction): Promise<void> {
    const welcomeTemplatePath = this.resolveFilePath();

    await this.email.send(
      {
        from: 'Gabriel Ferraz | Platform <platform.team@gmail.com>',
        to: action.data.to,
        subject: '[Platform Team] Welcome to Platform',
      },
      {
        path: welcomeTemplatePath,
        data: {
          title: 'Welcome',
          user_full_name: action.data.fullName,
        },
      },
    );
  }
}

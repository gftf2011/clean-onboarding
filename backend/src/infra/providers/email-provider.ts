import * as nodemailer from 'nodemailer';

import {
  EmailConfig,
  EmailOptions,
  EmailTemplate,
  EmailProvider,
  TemplateProvider,
} from '../../application/contracts/providers';

export class NodemailerEmailProvider implements EmailProvider {
  constructor(
    private readonly config: EmailConfig,
    private readonly template: TemplateProvider,
  ) {}

  async send(options: EmailOptions, context: EmailTemplate): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: false,
      auth: {
        user: this.config.username,
        pass: this.config.password,
      },
    });

    await transporter.sendMail({
      from: options.from,
      to: options.to,
      subject: options.subject,
      html: await this.template.parse({
        data: context.data,
        filePath: context.path,
      }),
    });
  }
}

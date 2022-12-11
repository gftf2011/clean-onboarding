import * as nodemailer from 'nodemailer';

import {
  EmailConfig,
  EmailOptions,
  EmailTemplate,
  IEmailProvider,
  ITemplateProvider,
} from '../../application/contracts/providers';

export class NodemailerEmailProvider implements IEmailProvider {
  constructor(
    private readonly config: EmailConfig,
    private readonly template: ITemplateProvider,
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

import * as nodemailer from 'nodemailer';

import {
  EmailConfig,
  EmailOptions,
  EmailTemplate,
  IEmailService,
  ITemplateService,
} from '../../application/contracts/providers';

export class NodemailerEmailService implements IEmailService {
  constructor(
    private readonly config: EmailConfig,
    private readonly templateService: ITemplateService,
  ) {}

  async send(options: EmailOptions, context: EmailTemplate): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      auth: {
        user: this.config.username,
        pass: this.config.password,
      },
    });

    await transporter.sendMail({
      from: options.from,
      to: options.to,
      subject: options.subject,
      html: await this.templateService.parse({
        data: context.data,
        filePath: context.path,
      }),
    });
  }
}

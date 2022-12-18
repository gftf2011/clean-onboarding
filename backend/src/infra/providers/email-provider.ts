/* eslint-disable max-classes-per-file */
import * as nodemailer from 'nodemailer';

import {
  EmailConfig,
  EmailOptions,
  EmailTemplate,
  EmailProvider,
  TemplateProvider,
} from '../../application/contracts/providers';

export type EmailProviderProduct = EmailProvider;

class NodemailerEmailProviderProduct implements EmailProviderProduct {
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

abstract class EmailProviderCreator implements EmailProvider {
  protected abstract factoryMethod(): EmailProviderProduct;

  public async send(
    options: EmailOptions,
    context: EmailTemplate,
  ): Promise<void> {
    const emailProvider = this.factoryMethod();
    const response = await emailProvider.send(options, context);
    return response;
  }
}

export class NodemailerEmailProviderCreator extends EmailProviderCreator {
  constructor(
    private readonly config: EmailConfig,
    private readonly template: TemplateProvider,
  ) {
    super();
  }

  protected factoryMethod(): EmailProviderProduct {
    return new NodemailerEmailProviderProduct(this.config, this.template);
  }
}

import {
  EmailOptions,
  EmailProvider,
  EmailTemplate,
} from '../../../../src/application/contracts/providers';

export class EmailProviderSpy implements EmailProvider {
  public calls = 0;

  public async send(
    options: EmailOptions,
    context: EmailTemplate,
  ): Promise<void> {
    this.calls++;
  }
}

export type EmailConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
};

export type EmailOptions = {
  from: string;
  to: string;
  subject: string;
};

export type EmailTemplate = {
  path: string;
  data: any;
};

export interface IEmailService {
  send: (options: EmailOptions, context: EmailTemplate) => Promise<void>;
}

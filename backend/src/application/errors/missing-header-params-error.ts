import { ApplicationError } from './application-error';

export class MissingHeaderParamsError extends ApplicationError {
  constructor(fields: string[]) {
    super();
    this.message = `missing header parameter(s): [ ${fields.join(', ')} ].`;
    this.name = MissingHeaderParamsError.name;
  }
}

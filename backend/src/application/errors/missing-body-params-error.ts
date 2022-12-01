import { ApplicationError } from './application-error';

export class MissingBodyParamsError extends ApplicationError {
  constructor(fields: string[]) {
    super();
    this.message = `missing body parameter(s): [ ${fields.join(', ')} ].`;
    this.name = MissingBodyParamsError.name;
  }
}

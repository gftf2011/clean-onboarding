import { CreateUserSessionQuery } from '../../queries';
import { IQueryHandler } from '../interfaces';
import { ITokenProvider } from '../../providers';

export class CreateUserSessionQueryHandler implements IQueryHandler<string> {
  readonly operation: string = 'create-session';

  constructor(private readonly token: ITokenProvider) {}

  public async handle(action: CreateUserSessionQuery): Promise<string> {
    const response = this.token.sign({
      payload: { id: action.data.id },
      secret: action.data.secret,
    });

    return response;
  }
}

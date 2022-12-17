import { GetUserSessionQuery } from '../../queries';
import { IQueryHandler } from '../../contracts/handlers';
import {
  ITokenProvider,
  IUUIDProvider,
  NAMESPACES,
} from '../../contracts/providers';

export class GetUserSessionQueryHandler implements IQueryHandler<string> {
  readonly operation: string = 'create-session';

  constructor(
    private readonly token: ITokenProvider,
    private readonly uuid: IUUIDProvider,
  ) {}

  public async handle(action: GetUserSessionQuery): Promise<string> {
    const response = this.token.sign({
      payload: { id: action.data.id },
      secret: action.data.secret,
      subject: this.uuid.generateV5(
        action.data.email,
        NAMESPACES.USER_ACCESS_TOKEN,
      ),
    });

    return response;
  }
}

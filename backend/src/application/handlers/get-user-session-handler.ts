import { GetUserSessionAction } from '../actions';
import { Handler } from '../contracts/handlers';
import {
  ITokenProvider,
  IUUIDProvider,
  NAMESPACES,
} from '../contracts/providers';

export class GetUserSessionHandler implements Handler<string> {
  readonly operation: string = 'get-create-session';

  constructor(
    private readonly token: ITokenProvider,
    private readonly uuid: IUUIDProvider,
  ) {}

  private createrTokenSubject(userEmail: string): string {
    return this.uuid.generateV5(userEmail, NAMESPACES.USER_ACCESS_TOKEN);
  }

  public async handle(action: GetUserSessionAction): Promise<string> {
    const subject = this.createrTokenSubject(action.data.email);
    const token = this.token.sign({
      payload: { id: action.data.id },
      secret: action.data.secret,
      subject,
    });
    return token;
  }
}

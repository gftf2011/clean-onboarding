import { GetUserSessionAction } from '../actions';
import { Handler } from '../contracts/handlers';
import { TokenProvider, IDProvider, NAMESPACES } from '../contracts/providers';

export class GetUserSessionHandler implements Handler<string> {
  readonly operation: string = 'get-create-session';

  constructor(
    private readonly tokenProvider: TokenProvider,
    private readonly idProvider: IDProvider,
  ) {}

  private createrTokenSubject(userEmail: string): string {
    return this.idProvider.generateV5(userEmail, NAMESPACES.USER_ACCESS_TOKEN);
  }

  public async handle(action: GetUserSessionAction): Promise<string> {
    const subject = this.createrTokenSubject(action.data.email);
    const token = this.tokenProvider.sign({
      payload: { id: action.data.id },
      secret: action.data.secret,
      subject,
    });
    return token;
  }
}

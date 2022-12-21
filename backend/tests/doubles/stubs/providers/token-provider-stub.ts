import {
  TokenPayload,
  TokenProvider,
} from '../../../../src/application/contracts/providers';

export class TokenProviderStub implements TokenProvider {
  public sign(data: TokenPayload): string {
    return 'fake_token';
  }

  public verify(token: string, secret: string): any {
    return {};
  }
}

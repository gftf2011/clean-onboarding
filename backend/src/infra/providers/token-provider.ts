import jwt from 'jsonwebtoken';

import {
  TokenProvider,
  TokenPayload,
} from '../../application/contracts/providers';

export class JWTTokenProvider implements TokenProvider {
  constructor(private readonly expiresIn: string | number) {}

  public sign(data: TokenPayload): string {
    return jwt.sign(data.payload, data.secret, {
      expiresIn: this.expiresIn,
      subject: data.subject,
    });
  }

  public verify(token: string, secret: string): any {
    return jwt.verify(token, secret);
  }
}

import jwt from 'jsonwebtoken';

import { ITokenProvider, TokenPayload } from '../../application/providers';

export class TokenProvider implements ITokenProvider {
  constructor(private readonly expiresIn: string | number) {}

  public sign(data: TokenPayload): string {
    return jwt.sign(data.payload, data.secret, {
      expiresIn: this.expiresIn,
      subject: data.subject,
    });
  }
}

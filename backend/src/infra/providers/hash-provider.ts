import crypto from 'crypto';
import { promisify } from 'util';

import { HashProvider } from '../../application/contracts/providers';

export class HashSha512Provider implements HashProvider {
  async encode(value: string, salt: string): Promise<string> {
    const buffer = await promisify(crypto.pbkdf2)(
      value,
      salt,
      50000,
      512,
      'sha512',
    );
    return buffer.toString('base64');
  }
}

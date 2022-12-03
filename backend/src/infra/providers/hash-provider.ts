import crypto from 'crypto';
import { promisify } from 'util';

import { IHashProvider } from '../../application/contracts/providers';

export class HashProvider implements IHashProvider {
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

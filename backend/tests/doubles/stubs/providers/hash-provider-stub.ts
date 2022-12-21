import { HashProvider } from '../../../../src/application/contracts/providers';

export class HashProviderStub implements HashProvider {
  public async encode(
    value: string,
    salt?: string | undefined,
  ): Promise<string> {
    return `encoded_${value}-${salt}`;
  }
}

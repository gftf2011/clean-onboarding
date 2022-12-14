import {
  IDProvider,
  NAMESPACES,
} from '../../../../src/application/contracts/providers';

export class IDProviderStub implements IDProvider {
  constructor(private readonly uuidV4?: string) {}

  public generateV4(): string {
    return this.uuidV4 || '00000000-0000-0000-0000-000000000000';
  }

  public generateV5(name: string, namespace: NAMESPACES): string {
    return `${name}-${namespace}`;
  }
}

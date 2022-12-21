import {
  IDProvider,
  NAMESPACES,
} from '../../../../src/application/contracts/providers';

export class IDProviderStub implements IDProvider {
  public generateV4(): string {
    return '00000000-0000-0000-0000-000000000000';
  }

  public generateV5(name: string, namespace: NAMESPACES): string {
    return `${name}-${namespace}`;
  }
}

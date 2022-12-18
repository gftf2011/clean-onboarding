import { v4, v5 } from 'uuid';

import { IDProvider, NAMESPACES } from '../../application/contracts/providers';

export class UUIDProvider implements IDProvider {
  public generateV4(): string {
    return v4();
  }

  public generateV5(name: string, namespace: NAMESPACES): string {
    return v5(name, namespace as string);
  }
}

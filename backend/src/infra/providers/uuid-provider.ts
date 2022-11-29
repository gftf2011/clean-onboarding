import { v4, v5 } from 'uuid';

import { IUUIDProvider, NAMESPACES } from '../../application/providers';

export class UUIDProvider implements IUUIDProvider {
  public generateV4(): string {
    return v4();
  }

  public generateV5(name: string, namespace: NAMESPACES): string {
    return v5(name, namespace as string);
  }
}

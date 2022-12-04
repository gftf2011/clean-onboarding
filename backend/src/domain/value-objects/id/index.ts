import { Either, left, right } from '../../../shared';

import { InvalidIdError } from '../../errors';

export class ID {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public get(): string {
    return this.value;
  }

  private static validate(id: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
      id,
    );
  }

  public static create(id: string): Either<Error, ID> {
    if (!id || !ID.validate(id)) {
      return left(new InvalidIdError(id));
    }

    return right(new ID(id));
  }
}

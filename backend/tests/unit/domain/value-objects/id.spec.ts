import { ID } from '../../../../src/domain/value-objects';

import { InvalidIdError } from '../../../../src/domain/errors';

describe('ID', () => {
  it('should return "InvalidIdError" if id is "null"', () => {
    const response = ID.create(null as any);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidIdError(null as any));
  });

  it('should return "InvalidIdError" if id is "undefined"', () => {
    const response = ID.create(undefined as any);
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidIdError(undefined as any));
  });

  it('should return "InvalidIdError" if id is empty string', () => {
    const response = ID.create('');
    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toEqual(new InvalidIdError(''));
  });
});

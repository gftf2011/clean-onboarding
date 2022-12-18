import faker from 'faker';

import { FindUserAction } from '../../../../src/application/actions';

describe('Find User Action', () => {
  it('should return action', () => {
    const id = faker.datatype.uuid();

    const input = {
      id,
    };

    const query = new FindUserAction(input);

    expect(query.operation).toBe('find-user');
    expect(query.data).toEqual(input);
  });
});

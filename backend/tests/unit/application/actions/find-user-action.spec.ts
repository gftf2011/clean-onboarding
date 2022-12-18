import faker from 'faker';

import { FindUserAction } from '../../../../src/application/actions';

describe('Find User Action', () => {
  it('should return action', () => {
    const id = faker.datatype.uuid();

    const input = {
      id,
    };

    const action = new FindUserAction(input);

    expect(action.operation).toBe('find-user');
    expect(action.data).toEqual(input);
  });
});

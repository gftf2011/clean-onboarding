import {
  Action,
  ActionPublisher,
} from '../../../../../src/application/contracts/actions';

export class ActionPublisherSpy implements ActionPublisher {
  public actions: Action[] = [];

  public async publish(action: Action): Promise<void> {
    this.actions.push(action);
  }
}

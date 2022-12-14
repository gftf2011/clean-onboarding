import { IEvent } from '../contracts/events';

export namespace WelcomeEmailEvent {
  export type Data = {
    to: string;
    fullName: string;
  };
}

// It uses the command design pattern
export class WelcomeEmailEvent implements IEvent {
  readonly operation: string = 'welcome-email';

  constructor(public readonly data: WelcomeEmailEvent.Data) {}
}

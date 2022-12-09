import { IEvent } from '../contracts/events';

export namespace WelcomeEmailEvent {
  export type Data = {
    to: string;
    fullName: string;
  };
}

export class WelcomeEmailEvent implements IEvent {
  readonly operation: string = 'welcome-email';

  constructor(public readonly data: WelcomeEmailEvent.Data) {}
}

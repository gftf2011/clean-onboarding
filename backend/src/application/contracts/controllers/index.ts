export interface Controller {
  handle: (httpRequest: any) => Promise<any>;
}

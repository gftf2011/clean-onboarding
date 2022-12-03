import express, { Express } from 'express';

export class ExpressAdapter {
  private static instance: ExpressAdapter;

  private server: Express;

  private constructor() {}

  public static getInstance(): ExpressAdapter {
    if (!this.instance) {
      this.instance = new ExpressAdapter();
    }
    return this.instance;
  }

  public getServer(): Express {
    if (!this.server) {
      this.server = express();
    }
    return this.server;
  }
}

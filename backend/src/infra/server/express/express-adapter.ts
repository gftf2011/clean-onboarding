import express, { Express } from 'express';

// It uses the singleton design pattern
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

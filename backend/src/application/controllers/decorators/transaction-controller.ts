import { Controller } from '../../contracts/controllers';
import { IDatabase } from '../../contracts/database';

export class TransactionController implements Controller {
  constructor(
    private readonly decoratee: Controller,
    private readonly database: IDatabase,
  ) {}

  public async handle(request: any): Promise<any> {
    try {
      await this.database.createClient();
      await this.database.openTransaction();
      const response = await this.decoratee.handle(request);
      await this.database.commit();
      await this.database.closeTransaction();
      return response;
    } catch (err) {
      await this.database.rollback();
      await this.database.closeTransaction();
      throw err;
    }
  }
}

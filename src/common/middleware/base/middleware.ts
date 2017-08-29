import { express } from '../../../lib/express';

export abstract class BaseMiddleware {
  constructor(protected app: express.Express) {
    this.init();
  }

  public abstract init(): void
}

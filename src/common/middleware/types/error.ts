import { BaseMiddleware } from '../base/middleware';

export class AppError extends BaseMiddleware {
  public init() {
    this.app.use((req, res) => {
      let msg = `HTTP: 404: ${req.url} not found`
      res.status(404);
      req.xhr ? res.json({error: msg}) : res.end(msg);
    });
  }
}

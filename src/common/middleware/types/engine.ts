import * as path from 'path';

import { express } from '../../../lib/express';
import { consolidate } from '../../../lib/consolidate';

import { BaseMiddleware } from '../base/middleware';
import { NodeAppConfig, AppConfig } from '../../services/app-config';

export type ViewEngine = 'ejs' | 'ect' | 'html' | 'handlebars' | 'jade' | 'mustache' | 'pug' | 'react';

export class AppEngine extends BaseMiddleware {
  protected config: NodeAppConfig = AppConfig;
  private engine: ViewEngine = AppConfig.get('viewEngine:type') || this.config.get('viewEngine:type');

  public init() {
    this.setViewEngine();
  }

  protected setViewEngine(): void {
    if (!this.isValidEngine()) {
    } else {
      this.app.set('views', this.getViewsRoot());
      this.app.set('view engine', this.engine);
      this.app.engine(
        this.engine,
        consolidate[this.engine](this.getViewsRoot(), {cache: this.config.get('viewEngine:cache')}, (err: any, html: any) => {
          if (err) throw err;
          console.log(html);
        })
      );
    }
  }

  protected getViewsRoot(): string {
    return path.join(process.cwd(), 'views');
  }

  private isValidEngine(): Boolean {
     return !!consolidate[this.engine];
  }
}

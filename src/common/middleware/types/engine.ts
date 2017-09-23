import * as path from 'path';

import { express } from '../../../lib/express';
import { consolidate } from '../../../lib/consolidate';

import { BaseMiddleware } from '../base/middleware';
import { NodeAppConfig, AppConfig } from '../../services/app-config';

export type ViewEngineType = 'ejs' | 'ect' | 'html' | 'handlebars' | 'jade' | 'mustache' | 'pug' | 'react';
export type ViewEngine = {
  type: ViewEngineType,
  ext: string,
  cache: boolean
};

export class AppEngine extends BaseMiddleware {
  protected config: NodeAppConfig = AppConfig;

  public init() {
    this.setViewEngine();
  }

  protected setViewEngine(): void {
    const engine: ViewEngine = AppConfig.get('viewEngine') || this.config.get('viewEngine');

    if (!this.isValidEngine()) {
    } else {
      this.app.set('views', this.getViewsRoot());
      this.app.set('view engine', engine.ext);
      this.app.engine(
        engine.ext,
        consolidate[engine.type]
      );
    }
  }

  protected getViewsRoot(): string {
    return path.join(process.cwd(), 'views');
  }

  private isValidEngine(): Boolean {
    const engine: ViewEngine = AppConfig.get('viewEngine') || this.config.get('viewEngine');
     return !!consolidate[engine.type];
  }
}

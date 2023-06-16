import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('run middlaware');
    createProxyMiddleware('/v1/api/auth/facebook', {
      target: 'http://localhost:8000',
      changeOrigin: true,
      pathRewrite: {
        '^/v1/api/auth/facebook/proxy': '/v1/api/auth/facebook',
      },
    })(req, res, next);
  }
}

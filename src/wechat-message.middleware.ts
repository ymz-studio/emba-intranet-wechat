import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class WechatMessageMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    let message = await new Promise(function (resolve, reject) {
      let buf = ''
      req.setEncoding('utf8')
      req.on('data', (chunk) => {
        buf += chunk
      })
      req.on('end', () => {
        resolve(buf)
      })
    })
    req.body = message;
    next()
  }
}

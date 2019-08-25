import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { createHash } from 'crypto';
import { CONFIG } from '../config';

interface Query {
  signature: string;
  timestamp: string;
  echostr: string;
  nonce: string;
}

@Injectable()
export class IsWechat implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const query: Query = request.query;
    const sha = createHash('sha1')
      .update([query.timestamp, query.nonce, CONFIG.token].sort().join(''))
      .digest('hex')

    return sha === query.signature;
  }
}

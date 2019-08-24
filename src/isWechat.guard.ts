import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { createHash } from 'crypto';
const TOKEN = 'test-token';

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
			.update([ query.echostr, query.nonce, TOKEN ].sort().join(''))
			.digest()
			.toString();

		return sha === query.signature;
	}
}

import { Injectable, HttpService } from '@nestjs/common';
import { CONFIG } from '../config';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { escape } from 'querystring'
export interface AccessTokenObject {
    token: string;
    expiredAt: Date;
}

export interface GetQrcodeResult {
    url: string; // 二维码地址
    expiredSecond: number; // 过期秒数
}

@Injectable()
export class AppService {
    private _tokenObject: AccessTokenObject = null;
    constructor(private readonly httpService: HttpService) { }
	/**
     * 在内存中缓存accessToken
     * @returns token
     */
    getAccessToken(): Observable<string> {
        const now = new Date();
        // 判断内存中是否缓存了token， 且token未过期
        if (!this._tokenObject || this._tokenObject.expiredAt.getTime() < now.getTime()) {
            return this.httpService
                .get('https://api.weixin.qq.com/cgi-bin/token', {
                    params: {
                        grant_type: 'client_credential',
                        appid: CONFIG.appID,
                        secret: CONFIG.appsecret
                    }
                })
                .pipe(
                    map((res) => {
                        // 刷新缓存
                        this._tokenObject = {
                            token: res.data.access_token,
                            expiredAt: new Date(now.getTime() + res.data.expires_in)
                        };
                        return this._tokenObject.token;
                    })
                );
        } else {
            return new Observable((sub) => {
                sub.next(this._tokenObject.token);
                sub.complete();
            });
        }
    }

    getQrcode(userID: number): Observable<GetQrcodeResult> {
        return this.getAccessToken().pipe(
            switchMap((token) =>
                this.httpService.post(
                    'https://api.weixin.qq.com/cgi-bin/qrcode/create',
                    {
                        expire_seconds: 600,
                        action_name: 'QR_SCENE',
                        action_info: { scene: { userID } }
                    },
                    {
                        params: {
                            access_token: token
                        }
                    }
                )
            ),
            map(res => ({
                url: `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${escape(res.data.ticket)}`,
                expiredSecond: res.data.expire_seconds
            }))
        );
    }
}

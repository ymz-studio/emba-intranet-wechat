import { Controller, Get, UseGuards, Query, Req, Post, Body, Res } from '@nestjs/common';
import { IsWechat } from './isWechat.guard';
import { AppService } from './app.service';
import wechatMessage from 'node-weixin-message';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) { }
	@Get()
	@UseGuards(IsWechat) // 验证消息是否来自微信
	// 测试连通性接口
	auth(@Query() { echostr }, @Req() req) {
		return echostr;
	}

	@Post()
	@UseGuards(IsWechat) // 验证消息是否来自微信
	handleMessage(@Req() req, @Res() res, @Body() body) {
		const messages = wechatMessage.messages;
		const reply = wechatMessage.reply;

		function onBundle(payload: BundleEventPayload) {
			let userID;
			let replyStr = '';

			if (payload.Event = 'SCAN') {
				userID = payload.EventKey;
			} else {
				replyStr = '感谢您的关注！'
				userID = payload.EventKey && payload.EventKey.slice(8);
			}
			if (userID) {
				replyStr += '您的账号已经绑定成功。'
			}
			console.log(payload);
			res.setHeader('content-type', 'text/xml');
			res.send(reply.text(payload.ToUserName, payload.FromUserName, replyStr));
		}
		messages.event.on.scan(onBundle);
		messages.event.on.subscribe(onBundle);
		messages.onXML(body);
	}

	@Get('qrcode')
	getQrcode() {
		return this.appService.getQrcode(1)
	}

	@Get('token')
	getToken() {
		return this.appService.getAccessToken()
	}
}

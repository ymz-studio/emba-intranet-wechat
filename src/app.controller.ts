import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { IsWechat } from './isWechat.guard';

@Controller()
export class AppController {
	@Get('')
	@UseGuards(IsWechat)
	hello(@Query() { echostr }) {
		return echostr;
	}
}

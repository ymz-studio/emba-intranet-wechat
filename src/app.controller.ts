import { Controller, Get, UseGuards } from '@nestjs/common';
import { IsWechat } from './isWechat.guard';

@Controller()
export class AppController {
	@Get('wx')
	@UseGuards(IsWechat)
	hello() {
		return 'hello!!';
	}
}

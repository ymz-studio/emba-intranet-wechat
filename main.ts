declare const module: any;

import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	await app.listen(3000, '0.0.0.0');
	console.log('Server is running on http://localhost:1234');
	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
}

bootstrap();

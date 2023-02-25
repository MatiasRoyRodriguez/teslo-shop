import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common/services';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const logger = new Logger('Bootstrap');
	app.setGlobalPrefix('api');
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
		})
	);
	await app.listen(process.env.PORT);
	logger.log(`App running on port ${process.env.PORT}`);
}
bootstrap();

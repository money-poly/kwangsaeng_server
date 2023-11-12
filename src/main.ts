import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';
import { winstonLogger } from './global/config/winston-logger.config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { logger: winstonLogger });
    const configService = app.get(ConfigService);

    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

    await app.listen(configService.getOrThrow('SERVER_PORT'));
}
bootstrap();

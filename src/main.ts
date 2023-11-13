import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { winstonLogger } from './global/config/winston-logger.config';
import { CommonExceptionFilter } from './global/exception/common.exception';
import { HttpExceptionFilter } from './global/filter/http-exception.filter';
import { TransformInterceptor } from './global/interceptor/transform.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { logger: winstonLogger });
    const configService = app.get(ConfigService);
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new CommonExceptionFilter(), new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

    await app.listen(configService.getOrThrow('SERVER_PORT'));
}
bootstrap();

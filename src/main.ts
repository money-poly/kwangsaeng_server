import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { winstonLogger } from './global/config/winston-logger.config';
import { HttpExceptionFilter } from './global/filter/http-exception.filter';
import { TransformInterceptor } from './global/interceptor/transform.interceptor';
import { CommonExceptionFilter } from './global/filter/common-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { logger: winstonLogger });
    const configService = app.get(ConfigService);
    const reflector = app.get(Reflector);

    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new CommonExceptionFilter(), new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor(reflector));

    await app.listen(configService.getOrThrow('SERVER_PORT'));
}
bootstrap();

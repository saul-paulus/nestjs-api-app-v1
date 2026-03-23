import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port');

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const adapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(adapterHost));
  app.useGlobalInterceptors(new TransformInterceptor(adapterHost));

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('POS App API')
    .setDescription('The POS Application API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addGlobalParameters({
      name: 'x-tenant-id',
      in: 'header',
      required: false,
      description: 'The Tenant ID for multi-tenant requests',
    })
    .addTag('auth')
    .addTag('pos')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port || 3000);
  console.log(`Application is running on: http://localhost:${port}/api/v1`);
  console.log(`Swagger available at: http://localhost:${port}/docs`);
}
void bootstrap();

/* istanbul ignore file */

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './infrastructure/filters/domain-exception.filter';
import { InfrastructureExceptionFilter } from './infrastructure/filters/infrastructure-excepetion.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.useGlobalFilters(new DomainExceptionFilter(), new InfrastructureExceptionFilter());

  app.enableCors();
  
  await app.listen(process.env.PORT || 3000);
}

bootstrap();

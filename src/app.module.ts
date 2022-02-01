import { Module } from '@nestjs/common';
import { ApplicationModule } from './application/application.module';
import { DomainModule } from './domain/domain.module';

@Module({
  imports: [DomainModule, ApplicationModule],
  controllers: [],
  providers: [],
})
export class AppModule { }

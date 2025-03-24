import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CloudstackModule } from './infra/cloudstack/cloudstack.module';
import { GetUserModule } from './presentation/user/get-user/get-user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CloudstackModule,
    GetUserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

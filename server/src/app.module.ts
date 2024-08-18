import { Module } from '@nestjs/common';
import { AppController } from './modules/main/app.controller';
import { AppService } from './modules/main/app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AppResolver } from './modules/main/app.resolver';
import { GraphqlConfig } from './shared/config/graphql.config';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`${process.env.DB_URL}/${process.env.DB_NAME}`,{}),
    JwtModule.register({
      secret: String(process.env.JWT_SECRET_KEY),
      signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY},
      global: true,
    }),
    GraphqlConfig(),
    UserModule
    ,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}

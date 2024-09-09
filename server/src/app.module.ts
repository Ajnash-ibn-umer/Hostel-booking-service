import { Module } from '@nestjs/common';
import { AppController } from './modules/main/app.controller';
import { AppService } from './modules/main/app.service';
import { ConfigModule ,ConfigService} from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AppResolver } from './modules/main/app.resolver';
import { GraphqlConfig } from './shared/config/graphql.config';
import { UserModule } from './modules/user/user.module';
import { CounterModule } from './modules/counter/counter.module';
import { BookingModule } from './modules/booking/booking.module';
import { LocationModule } from './modules/location/location.module';
import ENV from './shared/variables/env.variables';

const configService = new ConfigService()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load:[ENV]
    }),
    MongooseModule.forRoot(`${configService.get<string>("DB_URL")}/${configService.get<string>("DB_NAME")}`,{}),
    JwtModule.register({
      secret: String(configService.get("JWT_ACCESS_TOKEN_SECRET_KEY")),
      signOptions: { expiresIn: configService.get("JWT_ACCESS_TOKEN_EXPIRY")},
      global: true,
    }),
    GraphqlConfig(),
    UserModule,
    CounterModule,
    BookingModule,
    LocationModule
    ,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}

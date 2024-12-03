import { Module } from '@nestjs/common';
import { AppController } from './modules/main/app.controller';
import { AppService } from './modules/main/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AppResolver } from './modules/main/app.resolver';
import { GraphqlConfig } from './shared/config/graphql.config';
import { UserModule } from './modules/user/user.module';
import { CounterModule } from './modules/counter/counter.module';
import { BookingModule } from './modules/booking/booking.module';
import { LocationModule } from './modules/location/location.module';
import { GalleryModule } from './modules/gallery/gallery.module';
import { PaymentGatewayModule } from './modules/payment-gateway/service/payment-gateway.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import ENV from './shared/variables/env.variables';
import { ModelDefinitions } from './database/modelDefinitions';
import { ContactUsRepository } from './repositories/contact-us.repository';
import { ComplaintsModule } from './modules/complaints/complaints.module';
import { DamageAndSplitModule } from './modules/damage_and_split/damage_and_split.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { MailerModule as NodeMailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from './modules/mailer/mailer.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CheckoutModule } from './modules/checkout/checkout.module';
import { LaundryModule } from './modules/laundry/laundry.module';
import { ComplaintRepository } from './modules/complaints/repository/complaints.repository';
import { UserRepository } from './modules/user/repository/user.repository';
import { RoomRepository } from './modules/booking/hostels/repositories/room.repository';
import { PaymentsRepository } from './modules/payments/repositories/payments.repository';

const configService = new ConfigService();
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [ENV],
    }),

    MongooseModule.forRoot(
      `${configService.get<string>('DB_URL')}/${configService.get<string>('DB_NAME')}`,
      {},
    ),

    MongooseModule.forFeature([
      ModelDefinitions.contactUsModel,
      ModelDefinitions.complaintsModel,
      ModelDefinitions.paymentsModel,
      ModelDefinitions.userModel,
      ModelDefinitions.roomModel,
    ]),
    JwtModule.register({
      secret: String(configService.get('JWT_ACCESS_TOKEN_SECRET_KEY')),
      signOptions: { expiresIn: configService.get('JWT_ACCESS_TOKEN_EXPIRY') },

      global: true,
    }),

    GraphqlConfig(),
    NodeMailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          secure: true,
          port: 465,
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASS'),
          },
        },
        defaults: {
          from: '"Oxtel"  <oxtel@gmail.com>',
        },
        template: {
          dir: __dirname + '/../templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    UserModule,
    CounterModule,
    BookingModule,
    LocationModule,
    GalleryModule,
    PaymentGatewayModule,
    InvoiceModule,
    ComplaintsModule,
    DamageAndSplitModule,
    PaymentsModule,
    MailerModule,
    CheckoutModule,
    LaundryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppResolver,
    ContactUsRepository,
    ComplaintRepository,
    UserRepository,
    RoomRepository,
    PaymentsRepository,
  ],
})
export class AppModule {}

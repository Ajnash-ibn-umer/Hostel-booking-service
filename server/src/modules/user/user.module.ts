import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserResolver } from './graphql/user.resolver';
import { UserRepository } from './repository/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { MODEL_NAMES } from 'src/database/modelNames';
import { UserSchema } from 'src/database/models/user.model';
import { ModelDefinitions } from 'src/database/modelDefinitions';
import { CounterModule } from '../counter/counter.module';
import { CounterService } from '../counter/counter.service';

@Module({
  providers: [UserResolver, UserService, UserRepository],
  imports: [
    MongooseModule.forFeature([
      ModelDefinitions.userModel,
      ModelDefinitions.counterModel,
    ]),
  ],
})
export class UserModule {}

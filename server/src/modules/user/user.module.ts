import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserResolver } from './user.resolver';
import { UserRepository } from './repository/user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { MODEL_NAMES } from 'src/database/modelNames';
import { UserSchema } from 'src/database/models/user.model';

@Module({
  providers: [UserResolver, UserService, UserRepository],
  imports:[
    MongooseModule.forFeature([{ name: MODEL_NAMES.USER, schema: UserSchema }])
  ]
})
export class UserModule {}

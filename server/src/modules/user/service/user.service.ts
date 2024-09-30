import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { UserRepository } from '../repository/user.repository';
import { STATUS_NAMES, USER_TYPES } from 'src/shared/variables/main.variable';
import mongoose from 'mongoose';
import { GraphQLError } from 'graphql';
import { ListUserInput } from '../dto/list-user.input';
import { responseFormat } from 'src/shared/graphql/queryProjection';
import { log } from 'console';
import { LoginResponse, User } from '../entities/user.entity';
import { CounterService } from 'src/modules/counter/counter.service';
import { MODEL_NAMES } from 'src/database/modelNames';
import {
  UserDocument,
  User as UserModel,
} from 'src/database/models/user.model';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { LoginAdminInput } from '../dto/login-amin.input';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(
    private userRepo: UserRepository,
    private readonly counterService: CounterService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async create(dto: CreateUserInput): Promise<User> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const user = await this.createUser(dto, session);
      await session.commitTransaction();
      return user;
    } catch (error) {
      await session.abortTransaction();
      throw new GraphQLError(error, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    } finally {
      session.endSession();
    }
  }
  async createUser(
    dto: CreateUserInput,
    session: mongoose.ClientSession = null,
  ): Promise<User> {
    try {
      //  Create counter
      const userNumberData = await this.counterService.getAndIncrementCounter(
        {
          entityName: MODEL_NAMES.USER,
        },
        1,
        session,
      );

      const userNo = `${userNumberData.prefix}${userNumberData.count}${userNumberData.suffix}`;
      //  Create user

      // TODO : appsword generation
      const userData: UserModel = {
        userNo: userNo,
        name: dto.name,
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        userType: dto.userType,
        roleId: dto.roleId,
        profileImgUrl: dto.profileImgUrl,
        status: STATUS_NAMES.ACTIVE,
        createdAt: new Date(),
      };
      if (dto.userType === USER_TYPES.ADMIN) {
        const saltOrRounds = Number(
          this.configService.get<number>('HASH_SALT'),
        );
        const hash = await bcrypt.hash(dto.password, saltOrRounds);
        userData['password'] = hash;
      }

      const newUser = await this.userRepo.create(userData, session);
      return newUser as User;
    } catch (error) {
      throw new GraphQLError(error, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }

  async list(dto: ListUserInput, projection: Record<string, any>) {
    try {
      console.log({ projection });

      let userAggregationArray = [];

      if (dto.searchingText !== '' && dto.searchingText !== null) {
        userAggregationArray.push({
          $match: {
            $or: [
              { name: new RegExp(dto.searchingText, 'i') },
              { phoneNumber: new RegExp(dto.searchingText, 'i') },
              { email: new RegExp(dto.searchingText, 'i') },
              { userNo: new RegExp(dto.searchingText, 'i') },
            ],
          },
        });
      }
      userAggregationArray.push({
        $match: {
          status: { $in: dto.statusFilter },
        },
      });

      if (dto?.userIds && dto?.userIds.length > 0) {
        const ModIds = dto.userIds.map((id) => new mongoose.Types.ObjectId(id));

        userAggregationArray.push({
          $match: {
            _id: { $in: ModIds },
          },
        });
      }

      switch (dto.sortType) {
        case 0:
          userAggregationArray.push({
            $sort: {
              createdAt: dto.sortOrder ?? 1,
            },
          });
          break;
        case 1:
          userAggregationArray.push({
            $sort: {
              name: dto.sortOrder ?? 1,
            },
          });
          break;
        case 2:
          userAggregationArray.push({
            $sort: {
              status: dto.sortOrder ?? 1,
            },
          });
          break;
        default:
          userAggregationArray.push({
            $sort: {
              _id: dto.sortOrder ?? 1,
            },
          });
          break;
      }
      if (dto.skip !== -1 && dto.limit !== -1) {
        userAggregationArray.push(
          {
            $skip: dto.skip ?? 0,
          },
          {
            $limit: dto.limit,
          },
        );
      }

      //project returning fields
      projection &&
        userAggregationArray.push(responseFormat(projection['list']));
      console.log(JSON.stringify(userAggregationArray));

      const userData = await this.userRepo.aggregate([
        {
          $match: {
            status: 1,
          },
        },
      ]);
      console.log(userData);

      let totalCount = 0;

      return {
        list: userData,
        totalCount: 0,
      };
    } catch (error) {
      return new GraphQLError(error.message ?? error, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }
}

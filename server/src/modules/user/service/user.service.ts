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

@Injectable()
export class UserService {
  constructor(
    private userRepo: UserRepository,
    private readonly counterService: CounterService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async create(dto: CreateUserInput): Promise<User> {
    try {
      // TODO: Create counter
      const userNumberData = await this.counterService.getAndIncrementCounter({
        entityName: MODEL_NAMES.USER,
      });

      const userNo = `${userNumberData.prefix}${userNumberData.count}${userNumberData.suffix}`;
      // TODO: Create user

      // TODO : appsword generation
      const saltOrRounds = Number(this.configService.get<number>('HASH_SALT'));
      const hash = await bcrypt.hash(dto.password, saltOrRounds);

      const userData: UserModel = {
        userNo: userNo,
        name: dto.name,
        email: dto.email,
        password: hash,
        phoneNumber: dto.phoneNumber,
        userType: dto.userType,
        roleId: dto.roleId,
        profileImgUrl: dto.profileImgUrl,
        status: STATUS_NAMES.ACTIVE,
        createdAt: new Date(),
      };
      const newUser = await this.userRepo.create(userData);
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

  async loginAdmin(dto: LoginAdminInput): Promise<LoginResponse> {
    try {
      const user = (await this.userRepo.findOne({
        email: dto.email,
        userType: USER_TYPES.ADMIN,
      })) as unknown as User;

      if (!user) {
        throw new GraphQLError('Invalid email or password', {
          extensions: {
            code: HttpStatus.UNAUTHORIZED,
          },
        });
      }

      const isPasswordValid = await bcrypt.compare(dto.password, user.password);

      if (!isPasswordValid) {
        throw new GraphQLError('Invalid email or password', {
          extensions: {
            code: HttpStatus.UNAUTHORIZED,
          },
        });
      }

      const token = this.jwtService.sign({
        userId: user._id,
        email: user.email,
        userType: USER_TYPES.ADMIN,
      });

      return {
        message: 'Login successful',
        token: token,
        user: user,
      };
    } catch (error) {
      throw new GraphQLError(error.message ?? 'Login failed', {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }
}

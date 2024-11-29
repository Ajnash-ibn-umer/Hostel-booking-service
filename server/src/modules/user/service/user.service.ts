import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { UserRepository } from '../repository/user.repository';
import { STATUS_NAMES, USER_TYPES } from 'src/shared/variables/main.variable';
import mongoose, { ClientSession } from 'mongoose';
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
import { ContractRepository } from 'src/repositories/contract.repository';
import { Lookup } from 'src/shared/utils/mongodb/lookupGenerator';

@Injectable()
export class UserService {
  constructor(
    private userRepo: UserRepository,
    private readonly counterService: CounterService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly contractRepository: ContractRepository,

    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async create(dto: CreateUserInput): Promise<User | GraphQLError> {
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
  ): Promise<User | any> {
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
        bookingId: dto.bookingId,
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
      return newUser;
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
      if (dto?.bookingStatusFilter && dto?.bookingStatusFilter.length > 0) {
        userAggregationArray.push(
          ...Lookup({
            modelName: MODEL_NAMES.BOOKING,
            params: { id: '$bookingId' },
            conditions: { $_id: '$$id' },
            innerPipeline: [
              {
                $match: {
                  bookingStatus: { $in: dto.bookingStatusFilter },
                },
              },
            ],
            responseName: 'booking',
          }),
          {
            $match: {
              booking: { $ne: null },
            },
          },
        );
      }

      if (
        (dto.roomIds && dto.roomIds.length > 0) ||
        (dto.hostelIds && dto.hostelIds.length > 0) ||
        (dto.contractIds && dto.contractIds.length > 0)
      ) {
        const queryPipe = [];
        if (dto.roomIds && dto.roomIds.length > 0) {
          const roomIds = dto.roomIds.map(
            (id) => new mongoose.Types.ObjectId(id),
          );

          queryPipe.push({
            $match: {
              roomId: { $in: roomIds },
            },
          });
        }
        if (dto.hostelIds && dto.hostelIds.length > 0) {
          const hostelIds = dto.hostelIds.map(
            (id) => new mongoose.Types.ObjectId(id),
          );

          queryPipe.push({
            $match: {
              propertyId: { $in: hostelIds },
            },
          });
        }
        if (dto.contractIds && dto.contractIds.length > 0) {
          const contractIds = dto.contractIds.map(
            (id) => new mongoose.Types.ObjectId(id),
          );

          queryPipe.push({
            $match: {
              _id: { $in: contractIds },
            },
          });
        }
        userAggregationArray.push(
          ...Lookup({
            modelName: MODEL_NAMES.CONTRACTS,
            params: { id: '$_id' },
            conditions: { $userId: '$$id' },
            innerPipeline: queryPipe,
            responseName: 'con',
          }),
          {
            $match: {
              con: { $ne: null },
            },
          },
        );
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
      if (projection['list']['booking']) {
        userAggregationArray.push(
          ...Lookup({
            modelName: MODEL_NAMES.BOOKING,
            params: { id: '$bookingId' },
            conditions: { $_id: '$$id' },
            project: responseFormat(projection['list']['booking']),
            responseName: 'booking',
          }),
        );
      }
      if (projection['list']['contract']) {
        let contractPipe = [];
        if (projection['list']['contract']['property']) {
          contractPipe.push(
            ...Lookup({
              modelName: MODEL_NAMES.HOSTEL,
              params: { id: '$propertyId' },
              project: responseFormat(
                projection['list']['contract']['property'],
              ),
              conditions: { $_id: '$$id' },
              responseName: 'property',
            }),
          );
        }

        if (projection['list']['contract']['bed']) {
          contractPipe.push(
            ...Lookup({
              modelName: MODEL_NAMES.BED,
              params: { id: '$bedId' },
              project: responseFormat(projection['list']['contract']['bed']),
              conditions: { $_id: '$$id' },
              responseName: 'bed',
            }),
          );
        }
        if (projection['list']['contract']['room']) {
          let roomPipe = [];
          if (projection['list']['contract']['room']['galleries']) {
            roomPipe.push(
              ...Lookup({
                modelName: MODEL_NAMES.GALLERY_ROOM_LINKS,
                params: { id: '$_id' },
                conditions: { $roomId: '$$id' },
                responseName: 'galleries',
                isNeedUnwind: false,
                innerPipeline: [
                  ...Lookup({
                    modelName: MODEL_NAMES.GALLERY,
                    params: { id: '$galleryId' },
                    project: responseFormat(
                      projection['list']['contract']['room']['galleries'],
                    ),
                    conditions: { $_id: '$$id' },
                    responseName: 'galleries',
                  }),
                ],
              }),
              {
                $addFields: {
                  galleries: '$galleries.galleries',
                },
              },
            );
          }
          contractPipe.push(
            ...Lookup({
              modelName: MODEL_NAMES.ROOM,
              params: { id: '$roomId' },
              innerPipeline: roomPipe,
              project: responseFormat(projection['list']['contract']['room']),
              conditions: { $_id: '$$id' },
              responseName: 'room',
            }),
          );
        }
        userAggregationArray.push(
          ...Lookup({
            modelName: MODEL_NAMES.CONTRACTS,
            params: { id: '$_id' },
            conditions: { $userId: '$$id' },
            innerPipeline: contractPipe,
            project: responseFormat(projection['list']['contract']),
            responseName: 'contract',
          }),
        );
      }
      const userData = await this.userRepo.aggregate(userAggregationArray);
      console.log(userData);

      let totalCount = 0;
      if (projection['totalCount']) {
        totalCount = await this.userRepo.totalCount(userAggregationArray);
      }

      return {
        list: userData,
        totalCount: 0,
      };
    } catch (error) {
      throw new GraphQLError(error.message ?? error, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }

  async activateUser(
    userId: string,
    session: mongoose.ClientSession,
  ): Promise<User | GraphQLError> {
    try {
      console.log('in CHeckin', userId);
      const user = await this.userRepo.findOne({ _id: userId });
      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: {
            code: HttpStatus.NOT_FOUND,
          },
        });
      }

      user.isActive = true;
      await user.save({ session });

      return user as any;
    } catch (error) {
      throw new GraphQLError(error.message ?? 'Error activating user', {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }

  async me(
    userId: string = null,
    userType: USER_TYPES,
    projection: Record<string, any>,
  ) {
    try {
      const uid = new mongoose.Types.ObjectId(userId);
      console.log({ userType });
      if (userType === USER_TYPES.ADMIN) {
        const user: any = await this.userRepo.aggregate([
          {
            $match: {
              _id: uid,
              status: STATUS_NAMES.ACTIVE,
              userType: USER_TYPES.ADMIN,
            },
          },
          {
            $limit: 1,
          },
          responseFormat(projection['user']),
        ]);

        if (!user || user.length === 0) {
          throw 'user not found';
        }
        return {
          user: user[0],
        };
      }
      const user: any = await this.userRepo.aggregate([
        {
          $match: {
            _id: uid,
            status: STATUS_NAMES.ACTIVE,
            userType: USER_TYPES.USER,
            isActive: true,
          },
        },
        {
          $limit: 1,
        },
        responseFormat(projection['user']),
      ]);

      if (!user || user.length === 0) {
        throw 'user not found';
      }

      const contractAggregationArray: any[] = [
        {
          $match: {
            userId: uid,
            status: STATUS_NAMES.ACTIVE,
          },
        },
        {
          $limit: 1,
        },
        responseFormat(projection['contract']),
      ];
      if (projection['contract']['property']) {
        contractAggregationArray.push(
          ...Lookup({
            modelName: MODEL_NAMES.HOSTEL,
            params: { id: '$propertyId' },
            project: responseFormat(projection['contract']['property']),
            conditions: { $_id: '$$id' },
            responseName: 'property',
          }),
        );
      }

      if (projection['contract']['bed']) {
        contractAggregationArray.push(
          ...Lookup({
            modelName: MODEL_NAMES.BED,
            params: { id: '$bedId' },
            project: responseFormat(projection['contract']['bed']),
            conditions: { $_id: '$$id' },
            responseName: 'bed',
          }),
        );
      }
      if (projection['contract']['room']) {
        let roomPipe = [];
        if (projection['contract']['room']['galleries']) {
          roomPipe.push(
            ...Lookup({
              modelName: MODEL_NAMES.GALLERY_ROOM_LINKS,
              params: { id: '$_id' },
              conditions: { $roomId: '$$id' },
              responseName: 'galleries',
              isNeedUnwind: false,
              innerPipeline: [
                ...Lookup({
                  modelName: MODEL_NAMES.GALLERY,
                  params: { id: '$galleryId' },
                  project: responseFormat(
                    projection['contract']['room']['galleries'],
                  ),
                  conditions: { $_id: '$$id' },
                  responseName: 'galleries',
                }),
              ],
            }),
            {
              $addFields: {
                galleries: '$galleries.galleries',
              },
            },
          );
        }
        contractAggregationArray.push(
          ...Lookup({
            modelName: MODEL_NAMES.ROOM,
            params: { id: '$roomId' },
            innerPipeline: roomPipe,
            project: responseFormat(projection['contract']['room']),
            conditions: { $_id: '$$id' },
            responseName: 'room',
          }),
        );
      }
      if (projection['contract']['booking']) {
        contractAggregationArray.push(
          ...Lookup({
            modelName: MODEL_NAMES.BOOKING,
            params: { id: '$bookingId' },
            project: responseFormat(projection['contract']['booking']),
            conditions: { $_id: '$$id' },
            responseName: 'booking',
          }),
        );
      }
      const contract: any = await this.contractRepository.aggregate(
        contractAggregationArray,
      );

      if (!contract || contract.length === 0) {
        throw ` Contract not found`;
      }

      return {
        message: 'Information fetched',
        user: user[0] || null,
        contract: contract[0] || null,
      };
    } catch (error) {
      throw new GraphQLError(error.message ?? error, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }

  async findOneUserByBookingId(
    bookingId: string,
    session: ClientSession = null,
  ) {
    try {
      const user = await this.userRepo.findOne({
        bookingId: bookingId,
        status: 1,
      });

      if (!user) {
        throw `User not found for bookingId: ${bookingId}`;
      }

      return user;
    } catch (error) {
      throw new GraphQLError(error.message ?? error, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }

  async findOneActivatedUserByPhone(phone: string, isActivated: boolean) {
    return this.userRepo.findOne({
      phoneNumber: phone,
      isActive: isActivated,
      status: 1,
    });
  }
}

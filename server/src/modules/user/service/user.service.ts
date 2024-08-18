import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { UserRepository } from '../repository/user.repository';
import { STATUS_NAMES } from 'src/shared/variables/main.variable';
import mongoose from 'mongoose';
import { GraphQLError } from 'graphql';
import { ListUserInput } from '../dto/list-user.input';
import { responseFormat } from 'src/shared/graphql/queryProjection';
import { log } from 'console';
@Injectable()
export class UserService {
  constructor(private userRepo: UserRepository) {}
  async create(dto: CreateUserInput) {
    try {


      const resp = await this.userRepo.create({...dto,userNo:"1"});

      if(!resp){
        throw("User creation failed !")
      }
      
      return resp;
    } catch (error) {
      throw new GraphQLError(error, {
        extensions: {
          code: HttpStatus.UNAUTHORIZED,
        },
      });
    }
  }

  async list(dto: ListUserInput, projection: Record<string,any>) {
    try {
      console.log({ projection });

      let userAggregationArray = [];

      if (dto.searchingText !== ''&& dto.searchingText !== null) {
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
      if (dto.skip !== -1 && dto.limit !== -1){
        userAggregationArray.push(
          {
            $skip: dto.skip ?? 0,
          },
          {
            $limit: dto.limit,
          },
        )}

      //project returning fields
      projection &&
        userAggregationArray.push(responseFormat(projection['list']));
console.log( JSON.stringify(userAggregationArray))

      const userData = await this.userRepo.aggregate([
        {
          $match:{
            status:1
          }
        }
      ]);
      console.log(userData);

      let totalCount = 0;
    
      return {
     
          list: userData,
          totalCount:0
      
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

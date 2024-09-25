import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCounterInput } from './dto/create-counter.input';
import {
  GetCounterByEntityNameInput,
  UpdateCounterInput,
} from './dto/update-counter.input';
import { CounterRepository } from './repository/counter.repository';
import { ClientSession } from 'mongoose';
import { GraphQLError } from 'graphql';
import { STATUS_NAMES } from 'src/shared/variables/main.variable';
import { Counter } from 'src/database/models/counter.model';
@Injectable()
export class CounterService {
  constructor(private readonly counterRepository: CounterRepository) {}

  async create(
    createCounterInput: CreateCounterInput,
    _userId_?: string,
    txnSession: ClientSession = null,
  ) {
    try {
      const newCounter = await this.counterRepository.create(
        {
          ...createCounterInput,
          createdAt: new Date(),
          count: 1,

          status: STATUS_NAMES.ACTIVE,
        },
        txnSession,
      );

      return newCounter;
    } catch (error) {
      throw new GraphQLError(error, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }

  async getCounterByEntityName(
    getCounterByEntityNameInput: GetCounterByEntityNameInput,
  ): Promise<Counter> {
    try {
      const counter = await this.counterRepository.findOne({
        entityName: getCounterByEntityNameInput.entityName,
      });
      if (!counter) {
        throw new GraphQLError('Counter not found', {
          extensions: {
            code: HttpStatus.NOT_FOUND,
          },
        });
      }
      return counter;
    } catch (error) {
      throw new GraphQLError(error, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }

  async getAndIncrementCounter(
    dto: GetCounterByEntityNameInput,
    increment: number = 1,
    session: ClientSession = null,
  ): Promise<Counter> {
    try {
      const counter = await this.counterRepository.findOneAndUpdate(
        { entityName: dto.entityName },
        { $inc: { count: increment } },
        session,
      );
      if (!counter) {
        throw 'Failed to get or create counter';
      }

      return counter;
    } catch (error) {
      console.log({ error });
      throw new GraphQLError(error, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    }
  }
}

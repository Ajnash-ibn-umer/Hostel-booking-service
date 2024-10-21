import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateDamageAndSplitInput } from './dto/create-damage_and_split.input';
import { UpdateDamageAndSplitInput } from './dto/update-damage_and_split.input';
import { DamageAndSplitRepository } from './repositories/damage-and-split.repository';
import { DamageAndSplitDetailsRepository } from './repositories/damage-and-split-details.repository';
import mongoose from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { GraphQLError } from 'graphql';
import { DamageAndSplit } from 'src/database/models/damage-and-split.model';
import { STATUS_NAMES } from 'src/shared/variables/main.variable';
import { DamageAndSplitDetails } from 'src/database/models/damage-and-split-details.model';

@Injectable()
export class DamageAndSplitService {
  constructor(
    private readonly damageAndSplitRepository: DamageAndSplitRepository,
    private readonly damageAndSplitDetailsRepository: DamageAndSplitDetailsRepository,

    @InjectConnection()
    private readonly connection: mongoose.Connection,
  ) {}
  async create(
    dto: CreateDamageAndSplitInput,
    userId: string,
  ): Promise<DamageAndSplit | GraphQLError> {
    const txnSession = await this.connection.startSession();
    await txnSession.startTransaction();
    try {
      const newDamageAndSplit = await this.damageAndSplitRepository.create(
        {
          hostelId: dto.hostelId,
          title: dto.title,
          description: dto.description,
          documentUrl: dto.documentUrl,
          totalAmount: dto.totalAmount,
          dueDate: dto.dueDate,

          status: STATUS_NAMES.ACTIVE,
          createdAt: new Date(),
        },
        txnSession,
      );

      if (dto.splitDetails && dto.splitDetails.length > 0) {
        // TODO: create payment also

        const details = dto.splitDetails.map((detail) => ({
          damageAndSplitId: newDamageAndSplit._id,
          userId: detail.userId,
          amount: detail.amount,
          status: STATUS_NAMES.ACTIVE,
          createdAt: new Date(),
        }));
        await this.damageAndSplitDetailsRepository.insertMany(
          details as any,
          txnSession,
        );
      }

      await txnSession.commitTransaction();
      return newDamageAndSplit;
    } catch (error) {
      await txnSession.abortTransaction();
      throw new GraphQLError(error, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    } finally {
      await txnSession.endSession();
    }
  }
}

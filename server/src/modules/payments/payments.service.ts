import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePaymentInput } from './dto/create-payment.input';
import { UpdatePaymentInput } from './dto/update-payment.input';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { PaymentsRepository } from './repositories/payments.repository';
import { Payment, PaymentStatus } from 'src/database/models/payments.model';
import { GraphQLError } from 'graphql';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentRepo: PaymentsRepository,

    @InjectConnection()
    private readonly connection: mongoose.Connection,
  ) {}
  async create(
    dto: CreatePaymentInput[],
    userId: string,
    session: mongoose.ClientSession = null,
  ): Promise<Payment[]> {
    const txnSession = session ?? (await this.connection.startSession());
    !session && (await txnSession.startTransaction());
    try {
      const insertData = dto.map((data) => ({
        voucherType: data.voucherType,
        dueDate: data.dueDate,
        voucherId: data.voucherId,
        payAmount: data.payAmount,
        createdUserId: userId,
        createdAt: new Date(),
        paymentStatus: PaymentStatus.PENDING,
      }));

      const response = await this.paymentRepo.insertMany(
        insertData as any,
        txnSession,
      );
      if (!response) {
        throw 'Response not found in payment creation';
      }
      !session && (await txnSession.commitTransaction());
      return response;
    } catch (error) {
      !session && (await txnSession.abortTransaction());
      throw new GraphQLError(error, {
        extensions: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
      });
    } finally {
      !session && (await txnSession.endSession());
    }
  }
}

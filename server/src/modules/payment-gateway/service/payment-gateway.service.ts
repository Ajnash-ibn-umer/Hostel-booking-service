import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { error } from 'console';
import { GraphQLError } from 'graphql';
import { createHmac } from 'node:crypto';
import {
  CreateOrderInput,
  VerifyPaymentGatewayInput,
} from '../dto/create-order.input';
import {
  OrderResponse,
  paymentVerifyResponse,
} from '../entities/order-response';
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const Razorpay = require('razorpay');
const {
  validatePaymentVerification,
  validateWebhookSignature,
} = require('razorpay/dist/utils/razorpay-utils');

@Injectable()
export class PaymentGatewayService {
  private instance = new Razorpay({
    key_id: process.env.RAZOR_PAY_KEY_ID,
    key_secret: process.env.RAZOR_PAY_SECRET_KEY,
  });
  createPaymentOrder(orderOptn: CreateOrderInput): Promise<OrderResponse> {
    return new Promise<OrderResponse>(async (resolve, reject) => {
      try {
        const options = {
          amount: orderOptn.amount,
          currency: 'INR',
          receipt: 'receipt_' + Math.random().toString(36).substring(7),
        };

        const order = await this.instance.orders.create(options);
        console.log(order);
        resolve({
          order_id: order.id,
          //   order_data: order,
          order_status: order.status,
        });
      } catch (err) {
        console.log({ err });
        let error = err;
        if (err.statusCode) {
          error = err?.error?.description ?? '';
        }
        reject(
          new GraphQLError(error, {
            extensions: {
              code: HttpStatus.INTERNAL_SERVER_ERROR,
            },
          }),
        );
      }
    });
  }

  verifyPaymentGatewayOrder(
    verifyPaymentInput: VerifyPaymentGatewayInput,
  ): Promise<paymentVerifyResponse> {
    return new Promise<paymentVerifyResponse>(async (resolve, reject) => {
      try {
        let isValid = false;
        isValid = validatePaymentVerification(
          {
            order_id: verifyPaymentInput.razorPay_orderId,
            payment_id: verifyPaymentInput.razorPay_paymentId,
          },
          verifyPaymentInput.razorPay_signature,
          process.env.RAZOR_PAY_SECRET_KEY,
        );

        const hashData = createHmac('sha256', process.env.RAZOR_PAY_SECRET_KEY)
          .update(
            verifyPaymentInput.razorPay_orderId +
              '|' +
              verifyPaymentInput.razorPay_paymentId,
          )
          .digest('hex');

        if (verifyPaymentInput.razorPay_signature == hashData) {
          isValid = true;
        }
        console.log({ isValid });
        if (!isValid) {
          throw 'Payment is Failed';
        }
        return resolve({
          message: 'Payment success',
          status: true,
          transactionId: verifyPaymentInput.razorPay_paymentId,
          payedAmount: 0,
          transactionDate: new Date(),
        });
      } catch (error) {
        reject(
          new GraphQLError(error, {
            extensions: {
              code: HttpStatus.INTERNAL_SERVER_ERROR,
            },
          }),
        );
      }
    });
  }
}

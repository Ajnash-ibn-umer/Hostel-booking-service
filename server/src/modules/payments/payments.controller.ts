import { Controller, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly PaymentService: PaymentsService) {}
  @Get()
  reccuringPay() {
    console.log('in req');
    this.PaymentService.reccuringPaymentGeneration();
  }
}

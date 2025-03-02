import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PaymentsService } from '../modules/payments/payments.service';
const http = require('http');
import { PaymentsRepository } from '../modules/payments/repositories/payments.repository';
import { ModelDefinitions } from 'src/database/modelDefinitions';

@Injectable()
export class CheckoutRecuringService {
  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  handleCron() {
    const options = {
      hostname: 'localhost',
      port: process.env.PORT || 8000,
      path: '/api/checkout',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      // Listen for data chunks
      res.on('data', (chunk) => {
        data += chunk;
      });

      // End of response
      res.on('end', () => {
        console.log('Response:', data);
      });
    });

    // Handle errors
    req.on('error', (error) => {
      console.error('Error:', error);
    });

    req.end();
  }
}

import { Global, Module } from '@nestjs/common';
import { CounterService } from './counter.service';
import { CounterResolver } from './counter.resolver';
import { CounterRepository } from './repository/counter.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelDefinitions } from 'src/database/modelDefinitions';

@Global()
@Module({
  providers: [CounterResolver, CounterService,
    CounterRepository
  ],
  imports: [
    MongooseModule.forFeature([
      ModelDefinitions.counterModel
    ])
  ],
  exports:[
    CounterService,
    CounterRepository,
    MongooseModule.forFeature([
      ModelDefinitions.counterModel
    ])

  ]
})
export class CounterModule {}

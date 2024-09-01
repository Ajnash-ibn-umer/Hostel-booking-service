import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CounterService } from './counter.service';
import { Counter } from './entities/counter.entity';
import { CreateCounterInput } from './dto/create-counter.input';
import { UpdateCounterInput } from './dto/update-counter.input';

@Resolver(() => Counter)
export class CounterResolver {
  constructor(private readonly counterService: CounterService) {}

  @Mutation(() => Counter)
  createCounter(@Args('createCounterInput') createCounterInput: CreateCounterInput) {
    return this.counterService.create(createCounterInput,null,null);
  }

}

import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { HostelsService } from './hostels.service';
import { Hostel } from './entities/hostel.entity';
import { CreateHostelInput } from './dto/create-hostel.input';
import { UpdateHostelInput } from './dto/update-hostel.input';

@Resolver(() => Hostel)
export class HostelsResolver {
  constructor(private readonly hostelsService: HostelsService) {}

  @Mutation(() => Hostel)
  createHostel(@Args('createHostelInput') createHostelInput: CreateHostelInput) {
    return this.hostelsService.create(createHostelInput);
  }

  @Query(() => [Hostel], { name: 'hostels' })
  findAll() {
    return this.hostelsService.findAll();
  }

  @Query(() => Hostel, { name: 'hostel' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.hostelsService.findOne(id);
  }

  @Mutation(() => Hostel)
  updateHostel(@Args('updateHostelInput') updateHostelInput: UpdateHostelInput) {
    return this.hostelsService.update(updateHostelInput.id, updateHostelInput);
  }

  @Mutation(() => Hostel)
  removeHostel(@Args('id', { type: () => Int }) id: number) {
    return this.hostelsService.remove(id);
  }
}

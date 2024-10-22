import { Field, ObjectType, PartialType } from '@nestjs/graphql';
import { Contract } from 'src/database/models/contract.model';
import { Booking } from './booking.entity';
import { Hostel } from '../hostels/entities/hostel.entity';
import { Bed } from '../hostels/entities/bed.entity';
import { Room } from '../hostels/entities/room.entity';

@ObjectType()
export class ContractInfo extends PartialType(Contract) {
  @Field(() => Room, { nullable: true })
  room: Room;

  @Field(() => Bed, { nullable: true })
  bed: Bed;

  @Field(() => Hostel, { nullable: true })
  property: Hostel;

  @Field(() => Hostel, { nullable: true })
  booking: Booking;
}

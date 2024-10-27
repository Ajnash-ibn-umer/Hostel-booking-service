import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateRoomTypeInput {
  @Field({ description: 'Name of the room type' })
  name: string;

  @Field({ description: 'Description of the room type', nullable: true })
  description: string;

  @Field({ description: 'Number of beds in the room' })
  bedCount: number;

  @Field({ description: 'Security deposit amount', nullable: true })
  securityDepositForLower: number;

  @Field({ description: 'Security deposit amount', nullable: true })
  securityDepositForUpper: number;

  @Field({ description: 'Upper limit of monthly rent' })
  rentMonthlyUpper: number;

  @Field({ description: 'Lower limit of monthly rent' })
  rentMonthlyLower: number;

  @Field({ description: 'Lower limit of daily rent' })
  rentDailyLower: number;

  @Field({ description: 'Upper limit of daily rent' })
  rentDailyUpper: number;
}

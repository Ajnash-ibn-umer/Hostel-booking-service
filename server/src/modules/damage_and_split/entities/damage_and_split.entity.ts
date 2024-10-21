import { ObjectType, Field, Int } from '@nestjs/graphql';
import { DamageAndSplit } from 'src/database/models/damage-and-split.model';

@ObjectType()
export class DamageAndSplitListResponse {
  @Field(() => [DamageAndSplit], { nullable: true })
  list: DamageAndSplit[];

  @Field(() => Number, { nullable: true })
  totalCount: number;
}

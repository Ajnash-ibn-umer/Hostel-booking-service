import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateInvoiceInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}

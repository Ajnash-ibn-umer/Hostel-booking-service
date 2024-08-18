import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import enumToString from "src/shared/utils/enumTostring";
import { STATUS_NAMES } from "src/shared/variables/main.variable";

@ObjectType()
export class generalResponse {
  @Field()
  message: string;
}

@ObjectType()
export class infoResponse {
  @Field()
  version: string;

  @Field()
  date: string;

  @Field()
  description: string;
}

@ObjectType()
export class Base {
  @Field(()=>Int,{nullable:true,description:enumToString(STATUS_NAMES)})
  status?: STATUS_NAMES;

  @Field(()=>Date,{nullable:true})
  createdAt?: Date;

  @Field(()=>Date,{nullable:true})
  updatedAt?: Date;

  @Field(()=>ID,{nullable:true})
  createdUserId?: string;

  @Field(()=>ID,{nullable:true})
  updatedUserId?: string;
}
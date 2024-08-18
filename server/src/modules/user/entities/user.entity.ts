import enumToString from 'src/shared/utils/enumTostring';
import { ObjectType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { Base } from 'src/shared/graphql/entities/main.entity';
import { USER_TYPES } from 'src/shared/variables/main.variable';

@ObjectType()
export class User extends PartialType(Base){
 
  @Field({nullable:true})
  userNo:string 
  
  @Field({nullable:true})
  name:string 
  
  @Field({nullable:true})
  email:string 
  
  @Field({nullable:true})
  password:string 
  
  @Field({nullable:true})
  phoneNumber:string  
  
  @Field({description:enumToString(USER_TYPES),nullable:true})
  userType:number            
  
  @Field(()=>ID,{nullable:true})
  roleId:string 
  
  @Field({nullable:true})
  profileImgUrl:string  
  
  @Field(()=>ID,{nullable:true})
  admissionFormId:string 
}


@ObjectType()
export class ListUsersResponse{

  
  @Field(()=>[User],{nullable:true})
  list:User[]


  @Field({nullable:true})
  totalCount:number
}
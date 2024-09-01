import { InputType, Int, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {

  
  @Field()
  name:string 
  
  @Field({nullable:true})
  email:string 
  
  @Field({nullable:true})
  password:string 
  
  @Field({nullable:true})
  phoneNumber:string  
  
  
  @Field({nullable:true})
  profileImgUrl:string  

  @Field(()=>ID,{nullable:true})
  roleId:string  

  userType:number

}

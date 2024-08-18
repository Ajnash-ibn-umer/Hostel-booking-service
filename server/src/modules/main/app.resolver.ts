import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { infoResponse } from 'src/shared/graphql/entities/main.entity';

@Resolver()
export class AppResolver {


    // @Mutation(()=>generalResponse)
// async init(){ 
//     return this.appService.projectInit()
// }

@Query(()=>infoResponse)
async info():Promise<infoResponse>{ 
    return {
        date:"8/12/2023",
        version:"1.3",
        description:"This is a updated test version"
    }
}

}

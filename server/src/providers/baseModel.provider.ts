import { getConnectionToken } from "@nestjs/mongoose";
import {Document,Connection,Schema} from "mongoose"

export const tenantModel =(modelName:string,schema:Schema)=>({
    productModel:{
        provide: modelName,
        useFactory: async (tenantConnection:Connection) => {
      console.log({tenantConnection});
      
          return tenantConnection.model(modelName, schema)
        },
        inject: [getConnectionToken()],
    }

})
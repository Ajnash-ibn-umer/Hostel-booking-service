import { Model } from "mongoose";

export const TotalCount=(model:Model<any>,aggregationArray:any[])=>{
    return new Promise(async (resolve,reject)=>{
        try {
            const idx = aggregationArray.findIndex((data) =>
            data.hasOwnProperty('$limit'),
          );
          if (idx !== -1) {
            aggregationArray.splice(idx, 1);
          }
          const idx2 = aggregationArray.findIndex((data) =>
            data.hasOwnProperty('$skip'),
          );
          if (idx2 !== -1) {
            aggregationArray.splice(idx2, 1);
          }
        
          const count = await model
            .aggregate(aggregationArray)
            .count('totalCount');
          resolve(count[0]?.totalCount)
        } catch (error) {
            reject(error)
        }
    })
  
}
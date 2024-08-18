
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
//@ts-ignore
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';


export const GraphqlConfig=()=>{
    return GraphQLModule.forRoot<ApolloDriverConfig>({
        driver: ApolloDriver,
        // context: {
        //   userLoader: new DataLoader(
        //     async (data: { userId: string; projection: string }[]): Promise<any> => {
        //       console.log({ data });
  
        //       return await authService.user(data)
              
        //     },
        //   ),
        // },
        autoSchemaFile: true,
        formatError: (error: any) => {
          const graphQLFormattedError = {
            message:
              error.extensions?.exception?.response?.message || error.message,
            code: error.extensions?.code || 'SERVER_ERROR',
            name: error.extensions?.exception?.name || error.name,
          };
          return graphQLFormattedError;
        },
        sortSchema: true,
        playground: false,
        // introspection:   process.env.IS_ENABLE_SANDBOX === 'true' ? true : false,
        introspection:  true,
  
        plugins: [ApolloServerPluginLandingPageLocalDefault({})],
      })
}
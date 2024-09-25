import variables from "@/config/variables";
import { ApolloClient, InMemoryCache, ApolloProvider   } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
export const GraphqlClient = new ApolloClient({
  ssrMode: true,
  uri: `${variables.backend_url}/${variables.api_endpoint}`,
  cache: new InMemoryCache(),
  headers:{
    Authorization:`${ typeof window !==  "undefined" && localStorage.getItem("authToken")}`
  }
});

const ApolloAppProvider = ({ children }: any) => {
  return (
    <ApolloProvider client={GraphqlClient}>{children}</ApolloProvider>
  );
};

export default ApolloAppProvider;



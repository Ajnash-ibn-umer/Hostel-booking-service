import variables from "@/config/variables";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  ApolloLink,
  concat,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";

import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

// Adds messages only in a dev environment
loadDevMessages();
loadErrorMessages();

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(
      ({ message, extensions, locations, path, code }: any) => {
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
          console.log({ code, message });
        if (code === 401) {
          localStorage.removeItem("authToken");
          window.location.href = "/auth/signin";
          // redirect to login page
        } else {
          // handle other errors
        }
      },
    );
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});
const httpLink = new HttpLink({
  uri: `${variables.backend_url}/${variables.api_endpoint}`,
});
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("authToken");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : "222",
    },
  };
});
const link = ApolloLink.from([ errorLink, httpLink]);
export const GraphqlClient = new ApolloClient({
  ssrMode: true,
  uri: `${variables.backend_url}/${variables.api_endpoint}`,
  cache: new InMemoryCache(),
  link: concat(authLink, link),
  // headers: {
  //   Authorization: `${typeof window !== "undefined" && localStorage.getItem("authToken")}`,
  // },
});

const ApolloAppProvider = ({ children }: any) => {
  return <ApolloProvider client={GraphqlClient}>{children}</ApolloProvider>;
};

export default ApolloAppProvider;

import { createContext, useContext, useRef, ReactNode } from "react";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  NormalizedCacheObject
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { appApolloCacheConfig, GLOBAL_UI } from "./app/config";

const UnsecureClient = createContext<ApolloClient<NormalizedCacheObject>>(null as any);

export function UnsecureClientProvider({ children }: { children: ReactNode }) {
  const httpLink = createHttpLink({
    uri: GLOBAL_UI
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );

    if (networkError) console.error(`[Network error]: ${networkError}`);
  });

  const client = useRef(
    new ApolloClient({
      link: from([errorLink, httpLink]),
      cache: new InMemoryCache(appApolloCacheConfig)
    })
  );

  return (
    <UnsecureClient.Provider value={client.current}>{children}</UnsecureClient.Provider>
  );
}

export function useUnsecureClient() {
  return useContext(UnsecureClient);
}

import { InMemoryCache } from "@apollo/client";
import {
  MockedProvider as ApolloMockedProvider,
  MockedProviderProps
} from "@apollo/client/testing";
import {
  MockGraphQLProvider,
  MockGraphqlProviderProps
} from "@vizexplorer/global-ui-core";
import { cacheConfig } from "../graphql";

export function MockedProvider({ children, ...rest }: MockedProviderProps) {
  return (
    <ApolloMockedProvider cache={new InMemoryCache(cacheConfig)} {...rest}>
      {children}
    </ApolloMockedProvider>
  );
}

export function GlobalMockedProvider({ children, ...rest }: MockGraphqlProviderProps) {
  return (
    <MockGraphQLProvider cache={new InMemoryCache(cacheConfig)} {...rest}>
      {children}
    </MockGraphQLProvider>
  );
}

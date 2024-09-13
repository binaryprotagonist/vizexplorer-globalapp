import { DefaultOptions } from "@apollo/client";

export const adminApolloDefaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: "cache-and-network"
  }
};

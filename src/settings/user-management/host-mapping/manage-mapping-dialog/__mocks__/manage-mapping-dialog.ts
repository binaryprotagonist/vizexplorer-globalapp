import { GraphQLError } from "graphql";
import { MappingSelectNativeHostFragment } from "../__generated__/host-code-select";
import {
  HostMappingUpdateDocument,
  HostMappingUpdateMutation,
  HostMappingUpdateMutationVariables,
  SiteDocument,
  SiteQuery,
  SiteQueryVariables,
  UnmappedNativeHostsDocument,
  UnmappedNativeHostsQuery,
  UnmappedNativeHostsQueryVariables,
  UserDocument,
  UserQuery,
  UserQueryVariables
} from "../__generated__/manage-mapping-dialog";

export const mockNativeHost: MappingSelectNativeHostFragment = {
  __typename: "PdNativeHost",
  nativeHostId: "123",
  firstName: "Zach",
  lastName: "Smith"
};

export const mockUser: NonNullable<UserQuery["user"]> = {
  __typename: "User",
  id: "1",
  firstName: "John",
  lastName: "Doe",
  pdHostMappings: [
    { __typename: "PdHostMapping", id: "1", siteId: "0", nativeHost: mockNativeHost }
  ]
};

export type MockUserQueryOpts = {
  user?: NonNullable<UserQuery["user"]>;
};

export function mockUserQuery({ user }: MockUserQueryOpts = {}) {
  const variables: UserQueryVariables = { id: "1" };
  const data: UserQuery = {
    user: user ?? mockUser
  };

  return {
    request: {
      query: UserDocument,
      variables
    },
    result: {
      data
    }
  };
}

export function mockSiteQuery() {
  const variables: SiteQueryVariables = { id: "0" };
  const data: SiteQuery = {
    site: {
      __typename: "Site",
      id: "0",
      name: "MGM"
    }
  };

  return {
    request: {
      query: SiteDocument,
      variables
    },
    result: {
      data
    }
  };
}

export type MockUnammedNativeHostsQueryOpts = {
  pdNativeHosts?: UnmappedNativeHostsQuery["pdNativeHosts"];
};

export function mockUnmappedNativeHostsQuery({
  pdNativeHosts
}: MockUnammedNativeHostsQueryOpts = {}) {
  const variables: UnmappedNativeHostsQueryVariables = { siteId: "0" };
  const data: UnmappedNativeHostsQuery = {
    pdNativeHosts: pdNativeHosts ?? []
  };

  return {
    request: {
      query: UnmappedNativeHostsDocument,
      variables
    },
    result: {
      data
    }
  };
}

export type MockHostMappingUpdateMutationOpts = {
  vars?: Partial<HostMappingUpdateMutationVariables["input"]>;
  mappings?: HostMappingUpdateMutation["pdHostMappingUpdate"];
  errors?: GraphQLError[];
};

export function mockHostMappingUpdateMutation({
  vars,
  mappings,
  errors
}: MockHostMappingUpdateMutationOpts = {}) {
  const variables: HostMappingUpdateMutationVariables = {
    input: {
      userId: "1",
      siteId: "0",
      nativeHostIds: [],
      ...vars
    }
  };
  const data: HostMappingUpdateMutation = {
    pdHostMappingUpdate: mappings ?? []
  };

  return {
    request: {
      query: HostMappingUpdateDocument,
      variables
    },
    result: {
      data,
      errors
    }
  };
}

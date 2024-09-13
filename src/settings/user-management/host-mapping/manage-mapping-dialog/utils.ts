import { ApolloCache, FetchResult } from "@apollo/client";
import { sortArray } from "../../../../view/utils";
import { UserDisplay } from "../../../../view/user/utils";
import { MappingSelectNativeHostFragment } from "./__generated__/host-code-select";
import {
  HostMappingUpdateMutation,
  HostMappingUpdateMutationVariables,
  UserDocument,
  UserQuery
} from "./__generated__/manage-mapping-dialog";
import { HostSelectOption } from "./types";

export function mappingAsOption(
  mapping: MappingSelectNativeHostFragment
): HostSelectOption {
  return {
    id: mapping.nativeHostId,
    name: UserDisplay.fullNameV2(mapping)
  };
}

export function buildMappingOptions(
  unmapped: MappingSelectNativeHostFragment[],
  selected?: HostSelectOption[]
) {
  const unmappedOptions = unmapped.map(mappingAsOption);
  const combined = selected ? unmappedOptions.concat(selected) : unmappedOptions;

  return sortArray(combined, true, (option) => option.name);
}

export function mappingUpdateVariables(
  userId: string,
  siteId: string,
  mappings: HostSelectOption[]
): HostMappingUpdateMutationVariables {
  return {
    input: { userId, siteId, nativeHostIds: mappings.map((mapping) => mapping.id) }
  };
}

export function mappingCacheUpdate(
  userId: string,
  cache: ApolloCache<HostMappingUpdateMutation>,
  { data }: FetchResult<HostMappingUpdateMutation>
) {
  if (!data?.pdHostMappingUpdate) return;

  const userQuery: UserQuery | null = cache.readQuery({
    query: UserDocument,
    variables: { id: userId }
  });
  if (!userQuery?.user) return;

  const newUser: UserQuery["user"] = {
    ...userQuery.user,
    pdHostMappings: data.pdHostMappingUpdate
  };

  cache.writeQuery({
    query: UserDocument,
    variables: { id: userId },
    data: {
      user: newUser
    }
  });
}

import { ApolloCache, FetchResult } from "@apollo/client";
import { UserActionType } from "../../../../view/user/types";
import { UserDisplay, canUser, isNoAccessUser } from "../../../../view/user/utils";
import {
  UserGroupCreateMutation,
  UserGroupCreateMutationVariables,
  UserGroupUpdateMutationVariables,
  UsersQuery
} from "./__generated__/manage-user-group-dialog";
import {
  MappedSelectOption,
  UnmappedOption,
  UsersSelectOption,
  ValidUserGroupForm
} from "./types";
import { UserGroupFragmentDoc } from "../__generated__/user-groups";

export function buildUserSelectOptions(
  users?: UsersQuery,
  targetGroupId?: string
): UsersSelectOption[] {
  if (!users?.vodUsers || !users.unmappedNativeHosts) return [];

  const vodUsers = users.vodUsers.filter((user) => {
    if (targetGroupId && user.pdUserGroup?.id === targetGroupId) return true;
    if (!user.pdHostMappings?.length) return false;

    const noAccessuser = isNoAccessUser(user.accessLevel);
    const canAccessPDSuite = canUser(user, { type: UserActionType.ACCESS_PD_SUITE });
    if (!noAccessuser && !canAccessPDSuite) return false;

    return !user.pdUserGroup;
  });

  const mappedOptions = buildMappedOptions(vodUsers);
  const unmappedOptions = buildUnmappedOptions(users.unmappedNativeHosts);
  const combinedOptions = mappedOptions.concat(unmappedOptions);
  combinedOptions.sort((a, b) => {
    if (a.group !== b.group) {
      return a.group.localeCompare(b.group);
    }

    return a.name.localeCompare(b.name);
  });

  return combinedOptions;
}

function buildUnmappedOptions(
  nativeHosts?: NonNullable<UsersQuery["unmappedNativeHosts"]>
): UnmappedOption[] {
  if (!nativeHosts) return [];

  return nativeHosts.map<UnmappedOption>((host) => ({
    group: "unmapped",
    name: UserDisplay.fullNameV2(host),
    nativeHost: { siteId: host.siteId, nativeHostId: host.nativeHostId }
  }));
}

function buildMappedOptions(
  users: NonNullable<UsersQuery["vodUsers"]>
): UsersSelectOption[] {
  return users.map<UsersSelectOption>((user) => {
    return {
      group: "mapped",
      userId: user.id,
      name: UserDisplay.fullNameV2(user),
      hostCodes: user.pdHostMappings?.map((m) => m.nativeHostId) ?? []
    };
  });
}

export function isUnmappedOption(option: UsersSelectOption): option is UnmappedOption {
  return option.group === "unmapped";
}

function isMappedOption(option: UsersSelectOption): option is MappedSelectOption {
  return option.group === "mapped";
}

export function formStateAsCreateGroupInput(
  formState: ValidUserGroupForm
): UserGroupCreateMutationVariables["input"] {
  const nativeHosts = formState.users.filter(isUnmappedOption);
  const vodUsers = formState.users.filter(isMappedOption);

  return {
    name: formState.name,
    excludeFromReports: !formState.includeInReports,
    guestInteractionType: formState.guestInteraction,
    members: vodUsers.map((u) => u.userId),
    nativeHosts: nativeHosts.map(({ nativeHost }) => ({
      siteId: nativeHost.siteId,
      nativeHostId: nativeHost.nativeHostId
    }))
  };
}

export function formStateAsUpdateGroupInput(
  groupId: string,
  formState: ValidUserGroupForm
): UserGroupUpdateMutationVariables["input"] {
  const nativeHosts = formState.users.filter(isUnmappedOption);
  const vodUsers = formState.users.filter(isMappedOption);

  return {
    id: groupId,
    name: formState.name,
    excludeFromReports: !formState.includeInReports,
    guestInteractionType: formState.guestInteraction,
    members: vodUsers.map((u) => u.userId),
    nativeHosts: nativeHosts.map(({ nativeHost }) => ({
      siteId: nativeHost.siteId,
      nativeHostId: nativeHost.nativeHostId
    }))
  };
}

export function userGroupCreateCacheUpdate(
  cache: ApolloCache<UserGroupCreateMutation>,
  { data }: FetchResult<UserGroupCreateMutation>
) {
  if (!data?.pdUserGroupCreate) return;

  cache.modify({
    fields: {
      pdUserGroups(existing = []) {
        const newGroup = cache.writeFragment({
          data: data.pdUserGroupCreate,
          fragment: UserGroupFragmentDoc,
          fragmentName: "UserGroup"
        });
        return [...existing, newGroup];
      }
    }
  });
}

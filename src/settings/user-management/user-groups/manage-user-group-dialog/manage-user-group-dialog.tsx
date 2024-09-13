import { PdGuestInteractionType } from "generated-graphql";
import {
  Dialog,
  DialogHeader,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
  LoadingButton,
  Button,
  Callout,
  useGlobalTheme
} from "@vizexplorer/global-ui-v2";
import { HelpTip } from "view-v2/help-tip";
import { Box, styled } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import {
  GUEST_INTERATION_OPTIONS,
  GuestInteractionExt,
  UserGroupForm,
  UsersSelectOption,
  ValidUserGroupForm
} from "./types";
import { AccountCircleOutlined } from "view-v2/icons";
import { Select } from "view-v2/select";
import { UsersSelect } from "./users-select";
import { gql } from "@apollo/client";
import {
  ManageUserGroupUserGroupFragment,
  useUserGroupCreateMutation,
  useUserGroupLazyQuery,
  useUserGroupUpdateMutation,
  useUserGroupsQuery,
  useUsersQuery
} from "./__generated__/manage-user-group-dialog";
import {
  buildUserSelectOptions,
  formStateAsCreateGroupInput,
  formStateAsUpdateGroupInput,
  isUnmappedOption,
  userGroupCreateCacheUpdate
} from "./utils";
import { useAlert } from "view-v2/alert";
import { UserGroupFragmentDoc } from "../__generated__/user-groups";
import { InputLabel } from "view-v2/input-label";

const FieldContainer = styled("div")({
  display: "grid"
});

const ActionContainer = styled("div")({
  display: "grid",
  gridTemplateColumns: "160px 160px",
  columnGap: "16px",
  justifyContent: "end",
  margin: "40px 16px 24px 16px"
});

type Props = {
  groupId?: string;
  onSave?: VoidFunction;
  onClose?: VoidFunction;
};

export function ManageUserGroupDialog({ groupId, onSave, onClose }: Props) {
  const [formState, setFormState] = useState<UserGroupForm>(DEFAULT_FORM_STATE);
  const [error, setError] = useState<Error | null>(null);
  const { addAlert } = useAlert();

  const { data: usersData, loading: usersLoading } = useUsersQuery({
    onError: setError,
    fetchPolicy: "cache-and-network"
  });
  const [loadUserGroup, { data: userGroupData, loading: userGroupLoading }] =
    useUserGroupLazyQuery({
      onCompleted: (data) => {
        if (data?.userGroup) return;
        setError(Error("User group not found"));
      },
      onError: setError
    });
  const { data: userGroupsData, loading: userGroupsLoading } = useUserGroupsQuery({
    onError: setError,
    fetchPolicy: "cache-and-network"
  });

  const [createUserGroup, { loading: creatingGroup }] = useUserGroupCreateMutation();
  const [updateUserGroup, { loading: updatingUserGroup }] = useUserGroupUpdateMutation();

  const userSelectOptions = useMemo(() => {
    return buildUserSelectOptions(usersData, groupId);
  }, [usersData, userGroupsData, groupId]);

  const nativeHostSelected = formState.users.some(isUnmappedOption);
  const loading = usersLoading || userGroupLoading || userGroupsLoading;
  const formIsComplete = isFormComplete(formState);
  const saving = creatingGroup || updatingUserGroup;

  const hasUniqueName = useMemo(() => {
    if (!formState.name) return true;
    return !userGroupsData?.userGroups.some((group) => {
      return group.id !== groupId && group.name === formState.name;
    });
  }, [formState.name, userGroupsData, groupId]);

  useEffect(() => {
    if (!groupId || !userGroupData?.userGroup) return;
    setFormState(userGroupToFormState(userGroupData.userGroup, userSelectOptions));
  }, [userGroupData, userSelectOptions]);

  useEffect(() => {
    if (!groupId) return;
    loadUserGroup({ variables: { id: groupId } });
  }, [groupId]);

  function onCompleted() {
    const message = groupId ? "User group updated" : "User group added";
    addAlert({ message, severity: "success" });
    onSave?.();
  }

  function onError() {
    addAlert({
      message: "An unexpected error occurred while saving. Please try again.",
      severity: "error"
    });
  }

  function handleClickSave() {
    if (!formIsComplete) return;

    if (!groupId) {
      createUserGroup({
        variables: { input: formStateAsCreateGroupInput(formState) },
        onCompleted,
        onError,
        update: userGroupCreateCacheUpdate
      });
      return;
    }

    updateUserGroup({
      variables: { input: formStateAsUpdateGroupInput(groupId, formState) },
      onCompleted,
      onError
    });
  }

  if (error) throw error;

  return (
    <Dialog
      data-testid={"manage-user-group-dialog"}
      open
      PaperProps={{
        sx: { width: "520px" }
      }}
    >
      <DialogHeader
        data-testid={"dialog-header"}
        title={dialogTitle(!!groupId)}
        description={dialogDescription(!!groupId)}
        disableClose={saving}
        onClickClose={onClose}
      />

      <Box display={"flex"} flexDirection={"column"} rowGap={"26px"} p={"0 16px"}>
        <FieldContainer>
          <InputLabel htmlFor={"manage-group-group-name"}>Group Name</InputLabel>
          <TextField
            fullWidth
            id={"manage-group-group-name"}
            data-testid={"group-name"}
            placeholder={"Enter group name"}
            disabled={saving || loading}
            value={formState.name}
            onChange={(e) => setFormState((cur) => ({ ...cur, name: e.target.value }))}
            error={!hasUniqueName}
            helperText={!hasUniqueName ? NAME_TAKEN_ERROR : ""}
          />
        </FieldContainer>

        <Box display={"flex"} justifyContent={"space-between"}>
          <FormSwitch
            data-testid={"greet-assignment"}
            label={"Greet assignment"}
            checked={!!formState.guestInteraction}
            help={GREET_ASSIGNMENT_HELP}
            disabled={saving || loading}
            onChange={(e) =>
              setFormState((cur) => ({
                ...cur,
                guestInteraction: e.target.checked ? "undetermined" : undefined
              }))
            }
          />

          <FormSwitch
            data-testid={"include-in-reports"}
            label={"Include in reports"}
            checked={formState.includeInReports}
            help={INCLUDE_IN_REPORTS_HELP}
            disabled={saving || loading}
            onChange={(e) =>
              setFormState((cur) => ({
                ...cur,
                includeInReports: e.target.checked
              }))
            }
          />
        </Box>

        {formState.guestInteraction && (
          <GuestInteractionSelect
            value={guestInteractionValue(formState.guestInteraction)}
            options={GUEST_INTERATION_OPTIONS}
            disabled={saving || loading}
            onChange={(guestInteraction) =>
              setFormState((cur) => ({ ...cur, guestInteraction }))
            }
          />
        )}

        <FieldContainer>
          <InputLabel>Users</InputLabel>
          <UsersSelect
            value={formState.users}
            options={userSelectOptions}
            disabled={saving || loading}
            loading={loading}
            onChange={(value) => {
              setFormState((cur) => ({
                ...cur,
                users: value
              }));
            }}
          />
        </FieldContainer>

        {nativeHostSelected && (
          <Box mt={"18px"}>
            <Callout
              severity={"warning"}
              title={"Unmapped users have been selected"}
              description={
                "Selecting unmapped users will create them with 'No Access' in the system"
              }
            />
          </Box>
        )}
      </Box>

      <ActionContainer>
        <Button
          variant={"outlined"}
          color={"neutral"}
          disabled={saving}
          onClick={onClose}
        >
          Cancel
        </Button>
        <LoadingButton
          variant={"contained"}
          color={"primary"}
          loading={saving}
          disabled={!formIsComplete}
          onClick={handleClickSave}
        >
          {saving ? "Saving" : "Save"}
        </LoadingButton>
      </ActionContainer>
    </Dialog>
  );
}

const GUEST_INTERACTION_HELP =
  "Type of guest that the hosts in this user group will receive greets and communicate with.";
const INCLUDE_IN_REPORTS_HELP =
  "Determine whether this user group will be included or not from base reporting.";
const GREET_ASSIGNMENT_HELP =
  "Determine whether the hosts in this user group can be assigned to greets.";
const NAME_TAKEN_ERROR =
  "The name entered is already in use. Please choose a unique name.";

const DEFAULT_FORM_STATE: UserGroupForm = {
  name: "",
  guestInteraction: "undetermined",
  includeInReports: false,
  users: []
};

function userGroupToFormState(
  group: ManageUserGroupUserGroupFragment,
  userOptions: UsersSelectOption[]
): UserGroupForm {
  return {
    name: group.name,
    guestInteraction: group.guestInteractionType,
    includeInReports: !group.excludeFromReports,
    users: userOptions.filter((u) => {
      if (u.group === "unmapped") return false;
      return group.members.some((m) => m.id === u.userId);
    })
  };
}

function isFormComplete(form: UserGroupForm): form is ValidUserGroupForm {
  return !!form.name && form.guestInteraction !== "undetermined" && form.users.length > 0;
}

function dialogTitle(editing?: boolean): string {
  return editing ? "Edit user group" : "Add a user group";
}

function dialogDescription(editing?: boolean): string {
  if (editing) return "";
  return "Please create the user group and select the users that will be part of it.";
}

function guestInteractionLabel(interaction: PdGuestInteractionType): string {
  switch (interaction) {
    case PdGuestInteractionType.All:
      return "All guests";
    case PdGuestInteractionType.Coded:
      return "Coded";
    case PdGuestInteractionType.Uncoded:
      return "Uncoded";
  }
}

function guestInteractionValue(
  interaction?: GuestInteractionExt
): PdGuestInteractionType | null {
  return !interaction || interaction === "undetermined" ? null : interaction;
}

type FormSwitchProps = {
  label: string;
  help: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

function FormSwitch({ label, help, checked, onChange, ...rest }: FormSwitchProps) {
  return (
    <FormControlLabel
      disableTypography
      labelPlacement={"start"}
      label={
        <Box display={"flex"} alignItems={"center"}>
          <Typography fontWeight={600}>{label}</Typography>
          <HelpTip
            data-testid={"help-tip"}
            title={help}
            placement={"right-start"}
            iconProps={{ sx: { verticalAlign: "middle" } }}
          />
        </Box>
      }
      control={<Switch checked={checked} color={"success"} onChange={onChange} />}
      sx={{ margin: 0 }}
      {...rest}
    />
  );
}

type GuestInteractionSelectProps = {
  value: PdGuestInteractionType | null;
  options: PdGuestInteractionType[];
  disabled: boolean;
  onChange: (value: PdGuestInteractionType) => void;
};

function GuestInteractionSelect({
  value,
  options,
  disabled,
  onChange
}: GuestInteractionSelectProps) {
  const theme = useGlobalTheme();

  return (
    <FieldContainer data-testid={"guest-interaction"}>
      <InputLabel id={"guest-interaction"} help={GUEST_INTERACTION_HELP}>
        Guest interaction
      </InputLabel>
      <Select
        // @ts-ignore allow null
        value={value}
        options={options}
        placeholder={"Select a guest type"}
        disabled={disabled}
        startAdornment={
          <AccountCircleOutlined style={{ fill: theme.colors.grey[500] }} />
        }
        onChange={(_e, value) => onChange(value)}
        getOptionLabel={guestInteractionLabel}
      />
    </FieldContainer>
  );
}

const _USERS_QUERY = gql`
  fragment ManageUserGroupVodUser on User {
    id
    firstName
    lastName
    accessLevel
    accessList {
      app {
        id
      }
    }
    pdUserGroup {
      id
    }
    pdHostMappings {
      id
      siteId
      nativeHostId
    }
  }

  fragment ManageUserGroupNativeHost on PdNativeHost {
    nativeHostId
    firstName
    lastName
    siteId
  }

  query users {
    vodUsers: users {
      ...ManageUserGroupVodUser
    }
    unmappedNativeHosts: pdNativeHosts {
      ...ManageUserGroupNativeHost
    }
  }
`;

const _USER_GROUP_QUERY = gql`
  fragment ManageUserGroupUserGroup on PdUserGroup {
    id
    name
    guestInteractionType
    excludeFromReports
    members {
      id
      firstName
      lastName
      pdHostMappings {
        id
      }
    }
  }

  query userGroup($id: ID!) {
    userGroup: pdUserGroup(id: $id) {
      ...ManageUserGroupUserGroup
    }
  }
`;

const _USER_GROUPS_QUERY = gql`
  query userGroups {
    userGroups: pdUserGroups {
      id
      name
    }
  }
`;

// utilize UserGroupFragmentDoc so that we can update the cache correctly for the user groups table
const _USER_GROUP_CREATE_MUTATION = gql`
  mutation userGroupCreate($input: PdUserGroupCreateInput!) {
    pdUserGroupCreate(input: $input) {
      ...UserGroup
    }
  }
  ${UserGroupFragmentDoc}
`;

const _USER_GROUP_UPDATE_MUTATION = gql`
  mutation userGroupUpdate($input: PdUserGroupUpdateInput!) {
    pdUserGroupUpdate(input: $input) {
      ...UserGroup
    }
  }
  ${UserGroupFragmentDoc}
`;

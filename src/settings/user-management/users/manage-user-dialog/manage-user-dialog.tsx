import { Box, InputAdornment, CircularProgress, styled } from "@mui/material";
import {
  Dialog,
  DialogHeader,
  Button,
  InputLabel,
  TextField,
  Typography,
  LoadingButton,
  FormHelperText,
  Tooltip
} from "@vizexplorer/global-ui-v2";
import { IconButton } from "view-v2/icon-button";
import { Select } from "view-v2/select";
import {
  OrgAccessLevel,
  useCurrentUserQuery,
  useEmailExistsLazyQuery
} from "generated-graphql";
import { useImmerReducer } from "use-immer";
import { manageUserReducer } from "./manage-user-reducer";
import { createReducerUser } from "./manage-user-reducer/utils";
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";
import { accessLevelLabel } from "../../utils";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { useFnDebounce } from "../../../../view/utils/utils";
import { EMAIL_PATTERN_REGEX } from "../../../../view/utils/email";
import {
  ErrorableField,
  FieldError,
  ReducerAction,
  ReducerState,
  ReducerUser
} from "./manage-user-reducer/types";
import { useAlert } from "view-v2/alert";
import {
  accessLevelOptions,
  isFormComplete,
  isNameTaken,
  noAccessUsersNames,
  passwordDisplay,
  requireEmailValidation,
  userManagementUserAsReducerUser,
  userToCreateUserV2Input,
  userToUserUpdateInput,
  hasFormChanged,
  showAccessList,
  showAccessLevel,
  userCreateCacheUpdate,
  userUpdateCacheUpdate
} from "./utils";
import { AccessList } from "./access-list";
import { gql } from "@apollo/client";
import {
  useUserAccessRowOptionsQuery,
  useUserCreateV2Mutation,
  useUserUpdateMutation,
  useUsersLazyQuery
} from "./__generated__/manage-user-dialog";
import { isOrgAdmin } from "../../../../view/user/utils";
import { UserManagement, PasswordDisplay } from "./types";
import { UserManagementUserFragmentDoc } from "../__generated__/users";

const StyledForm = styled("form")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
  overflow: "hidden"
});

const FieldsContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  rowGap: "24px",
  padding: "0 24px 8px 24px",
  overflow: "auto"
});

const FieldContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  width: "100%"
});

const InlineFieldsContainer = styled("div")({
  display: "flex",
  columnGap: "32px"
});

const ActionsContainer = styled("div")({
  display: "grid",
  gridTemplateColumns: "160px 160px",
  columnGap: "32px",
  alignSelf: "end",
  margin: "34px 24px 24px 24px"
});

type Props = {
  userManagement: UserManagement;
  onClose?: VoidFunction;
};

export function ManageUserDialog({ userManagement, onClose }: Props) {
  const [submittingForm, setSubmittingForm] = useState(false);
  const { addAlert } = useAlert();
  const debounce = useFnDebounce();
  const [{ user, fieldErrors }, dispatch] = useImmerReducer<ReducerState, ReducerAction>(
    manageUserReducer,
    {
      user:
        userManagement.type === "create-user"
          ? createReducerUser()
          : userManagementUserAsReducerUser(userManagement.user),
      fieldErrors: {}
    }
  );

  const {
    data: curUserData,
    loading: curUserLoading,
    error: curUserError
  } = useCurrentUserQuery();
  const {
    data: accessOptionsData,
    loading: accessOptionsLoading,
    error: accessOptionsErr
  } = useUserAccessRowOptionsQuery();
  const [loadUsers, { data: usersData, loading: usersLoading, error: usersError }] =
    useUsersLazyQuery({ fetchPolicy: "cache-and-network" });

  const [verifyEmail, { data: emailExists, loading: verifyingEmail }] =
    useEmailExistsLazyQuery({
      fetchPolicy: "no-cache",
      notifyOnNetworkStatusChange: true,
      onCompleted: (data) => {
        if (data?.emailExists) {
          addFieldError("email", "Email is taken");
        }
      }
    });
  const [createUser] = useUserCreateV2Mutation();
  const [updateUser] = useUserUpdateMutation();

  const currentUser = curUserData?.currentUser;
  const isCurUserOrgAdmin = !!currentUser && isOrgAdmin(currentUser.accessLevel);

  const takenUserNames = useMemo(() => {
    if (user.accessLevel !== OrgAccessLevel.NoAccess || !usersData?.users) return [];

    const excludeUserIds =
      userManagement.type === "create-user" ? [] : [userManagement.user.id];
    return noAccessUsersNames(usersData.users, excludeUserIds);
  }, [user.accessLevel, usersData]);

  function isFormValid() {
    const formChanged =
      userManagement.type === "create-user" || hasFormChanged(user, userManagement.user);
    const isEmailUnique = !verifyingEmail && emailExists?.emailExists === false;
    const isEmailValid =
      !requireEmailValidation(user, userManagement.user?.email) ||
      (!fieldErrors?.email && isEmailUnique && EMAIL_PATTERN_REGEX.test(user.email));

    return (
      isEmailValid &&
      !Object.keys(fieldErrors).length &&
      formChanged &&
      isFormComplete(user, userManagement.user?.accessLevel)
    );
  }

  function addFieldError(field: ErrorableField, error: string) {
    dispatch({
      type: "add-field-error",
      payload: { field, error }
    });
  }

  function clearFieldError(field: ErrorableField) {
    dispatch({
      type: "clear-field-error",
      payload: { field }
    });
  }

  function onCompleted() {
    const message = userManagement.type === "create-user" ? "User added" : "User updated";
    addAlert({ severity: "success", message });
    onClose?.();
    setSubmittingForm(false);
  }

  function onError() {
    setSubmittingForm(false);
    addAlert({
      severity: "error",
      message: "An unexpected error occurred while saving. Please try again."
    });
  }

  async function handleSave(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setSubmittingForm(true);

    if (!isFormValid()) return;

    if (requireEmailValidation(user, userManagement.user?.email)) {
      const { data } = await verifyEmail({ variables: { email: user.email } });
      if (data?.emailExists !== false) {
        setSubmittingForm(false);
        return;
      }
    }

    if (userManagement.type !== "create-user") {
      const userId = userManagement.user.id;
      const input = userToUserUpdateInput(currentUser!, userId, user, userManagement);
      updateUser({
        variables: { input },
        onCompleted,
        onError,
        update: (cache, data) => userUpdateCacheUpdate(userManagement.user, cache, data)
      });
      return;
    }

    const input = userToCreateUserV2Input(user);
    createUser({
      variables: { input },
      onCompleted,
      onError,
      update: userCreateCacheUpdate
    });
  }

  useEffect(() => {
    clearFieldError("email");
    if (!requireEmailValidation(user, userManagement.user?.email)) return;

    debounce(() => {
      if (!user.email) return;

      if (!EMAIL_PATTERN_REGEX.test(user.email)) {
        addFieldError("email", "Invalid email address");
        return;
      }

      verifyEmail({ variables: { email: user.email } });
    }, 300);
  }, [user.email]);

  useEffect(() => {
    if (isNameTaken(user, takenUserNames)) {
      addFieldError("name", "The name is already in use. Please choose a unique name.");
    } else {
      clearFieldError("name");
    }
  }, [user.firstName, user.lastName, takenUserNames]);

  useEffect(() => {
    if (user.accessLevel !== OrgAccessLevel.NoAccess) return;
    loadUsers();
  }, [user.accessLevel]);

  if (curUserError) throw curUserError;
  if (usersError) throw usersError;
  if (accessOptionsErr) throw accessOptionsErr;

  return (
    <Dialog
      data-testid={"manage-user-dialog"}
      data-loading={curUserLoading || accessOptionsLoading || usersLoading}
      open
      PaperProps={{
        sx: { maxWidth: "unset", width: "900px", height: "670px" }
      }}
    >
      <DialogHeader
        title={userManagement.type === "create-user" ? "Add a user" : "Edit user"}
        disableClose={submittingForm}
        onClickClose={onClose}
        px={"24px"}
      />

      <StyledForm noValidate id={"manage-user-form"} onSubmit={handleSave}>
        <FieldsContainer>
          {showAccessLevel(userManagement.type) && (
            <AccessLevel
              user={user}
              options={currentUser ? accessLevelOptions(currentUser.accessLevel) : []}
              disabled={submittingForm}
              hasEditPermission={
                isCurUserOrgAdmin || userManagement.type !== "update-other-user"
              }
              loadingOptions={curUserLoading}
              dispatch={dispatch}
            />
          )}

          {showAccessList(userManagement.type, user.accessLevel) && (
            <AccessList
              currentUser={currentUser}
              accessList={user.accessList}
              apps={accessOptionsData?.applications ?? []}
              sites={accessOptionsData?.sites ?? []}
              loadingOptions={accessOptionsLoading || curUserLoading}
              disabled={submittingForm}
              dispatch={dispatch}
            />
          )}

          {user.accessLevel && (
            <>
              <PersonalInfoFields
                user={user}
                fieldErrors={fieldErrors}
                disabled={submittingForm}
                hasEditPermission={
                  isCurUserOrgAdmin || userManagement.type !== "update-other-user"
                }
                dispatch={dispatch}
              />

              <CredentialFields
                user={user}
                disabled={submittingForm}
                verifyingEmail={!submittingForm && verifyingEmail}
                fieldErrors={fieldErrors}
                passwordDisplay={passwordDisplay(
                  user.accessLevel,
                  userManagement.user?.accessLevel
                )}
                hasEditPermission={
                  isCurUserOrgAdmin || userManagement.type !== "update-other-user"
                }
                dispatch={dispatch}
              />
            </>
          )}
        </FieldsContainer>

        <ActionsContainer>
          <Button
            variant={"outlined"}
            color={"neutral"}
            disabled={submittingForm}
            onClick={onClose}
          >
            Cancel
          </Button>
          <LoadingButton
            type={"submit"}
            variant={"contained"}
            disabled={!isFormValid() || usersLoading}
            loading={submittingForm}
          >
            {submittingForm ? "Saving" : "Save"}
          </LoadingButton>
        </ActionsContainer>
      </StyledForm>
    </Dialog>
  );
}

type AccessLevelProps = {
  user: ReducerUser;
  options: OrgAccessLevel[];
  disabled: boolean;
  hasEditPermission: boolean;
  loadingOptions: boolean;
  dispatch: React.Dispatch<ReducerAction>;
};

function AccessLevel({
  user,
  options,
  disabled,
  hasEditPermission,
  loadingOptions,
  dispatch
}: AccessLevelProps) {
  return (
    <Tooltip
      followCursor
      title={
        !hasEditPermission ? "You do not have permission to change the user's access" : ""
      }
      placement={"top"}
    >
      <FieldContainer>
        <InputLabel htmlFor={"manage-user-access-level"}>Access</InputLabel>
        <Select<OrgAccessLevel>
          id={"manage-user-access-level"}
          data-testid={"access-level"}
          // @ts-ignore allow null
          value={user.accessLevel}
          options={options}
          disabled={disabled || !hasEditPermission}
          loading={loadingOptions}
          startAdornment={<KeyRoundedIcon />}
          placeholder={"Select access"}
          getOptionLabel={accessLevelLabel}
          onChange={(_e, value) => {
            dispatch({
              type: "update-access-level",
              payload: { accessLevel: value }
            });
          }}
        />
      </FieldContainer>
    </Tooltip>
  );
}

type PersonalInfoFieldsProps = {
  user: ReducerUser;
  fieldErrors?: FieldError;
  disabled: boolean;
  hasEditPermission: boolean;
  dispatch: React.Dispatch<ReducerAction>;
};

function PersonalInfoFields({
  user,
  fieldErrors,
  disabled,
  hasEditPermission,
  dispatch
}: PersonalInfoFieldsProps) {
  return (
    <>
      <Tooltip
        followCursor
        title={
          !hasEditPermission ? "You do not have permission to change the user's name" : ""
        }
        placement={"top"}
      >
        <Box>
          <InlineFieldsContainer>
            <FieldContainer>
              <InputLabel htmlFor={"manage-user-first-name"}>First name</InputLabel>
              <TextField
                id={"manage-user-first-name"}
                data-testid={"first-name"}
                value={user.firstName}
                disabled={disabled || !hasEditPermission}
                onChange={(e) => {
                  dispatch({
                    type: "update-first-name",
                    payload: { firstName: e.target.value }
                  });
                }}
              />
            </FieldContainer>

            <FieldContainer>
              <InputLabel htmlFor={"manage-user-last-name"}>Last name</InputLabel>
              <TextField
                id={"manage-user-last-name"}
                data-testid={"last-name"}
                value={user.lastName}
                disabled={disabled || !hasEditPermission}
                onChange={(e) => {
                  dispatch({
                    type: "update-last-name",
                    payload: { lastName: e.target.value }
                  });
                }}
              />
            </FieldContainer>
          </InlineFieldsContainer>
          <FormHelperText error data-testid={"name-helper-text"}>
            {fieldErrors?.name}
          </FormHelperText>
        </Box>
      </Tooltip>

      <Tooltip
        followCursor
        title={
          !hasEditPermission
            ? "You do not have permission to change the user's phone"
            : ""
        }
        placement={"top"}
      >
        <FieldContainer>
          <InputLabel htmlFor={"manage-user-phone"}>Phone</InputLabel>
          <TextField
            id={"manage-user-phone"}
            data-testid={"phone"}
            value={user.phone}
            disabled={disabled || !hasEditPermission}
            onChange={(e) => {
              dispatch({
                type: "update-phone",
                payload: { phone: e.target.value }
              });
            }}
          />
        </FieldContainer>
      </Tooltip>
    </>
  );
}

type CredentialFieldsProps = {
  user: ReducerUser;
  disabled: boolean;
  verifyingEmail: boolean;
  fieldErrors?: FieldError;
  passwordDisplay: PasswordDisplay;
  hasEditPermission: boolean;
  dispatch: React.Dispatch<ReducerAction>;
};

function CredentialFields({
  user,
  disabled,
  verifyingEmail,
  fieldErrors,
  passwordDisplay,
  hasEditPermission,
  dispatch
}: CredentialFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPasswordField, setShowNewPasswordField] = useState(false);
  const newPasswordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!showNewPasswordField || !newPasswordRef.current) return;
    newPasswordRef.current.scrollIntoView({ behavior: "smooth" });
  }, [showNewPasswordField]);

  return (
    <Box display={"flex"} flexDirection={"column"} rowGap={"12px"}>
      {user.accessLevel !== OrgAccessLevel.NoAccess && (
        <Typography variant={"label"} fontWeight={600}>
          The work email and password will be the credentials to login. The first time the
          user logs in, we will ask for a new password.
        </Typography>
      )}

      <InlineFieldsContainer>
        <Tooltip
          followCursor
          title={
            !hasEditPermission
              ? "You do not have permission to change the user's email"
              : ""
          }
          placement={"top"}
        >
          <FieldContainer>
            <InputLabel htmlFor={"manage-user-email"}>Work email</InputLabel>
            <TextField
              id={"manage-user-email"}
              data-testid={"email"}
              type={"email"}
              autoComplete={"off"}
              value={user.email}
              disabled={disabled || !hasEditPermission}
              helperText={fieldErrors?.email ?? ""}
              error={!!fieldErrors?.email}
              onChange={(e) => {
                dispatch({
                  type: "update-email",
                  payload: { email: e.target.value }
                });
              }}
              InputProps={{
                endAdornment: verifyingEmail && (
                  <InputAdornment position={"end"}>
                    <CircularProgress
                      data-testid={"verifying-email"}
                      size={20}
                      sx={{ color: "#000" }}
                    />
                  </InputAdornment>
                )
              }}
            />
          </FieldContainer>
        </Tooltip>

        {passwordDisplay === "update" && (
          <Tooltip
            followCursor
            title={
              !hasEditPermission
                ? "You do not have permission to change the user's password"
                : ""
            }
            placement={"top"}
          >
            <FieldContainer mt={"26px"}>
              <Button
                variant={"outlined"}
                size={"small"}
                color={"neutral"}
                sx={{ height: "43px" }}
                onClick={() => setShowNewPasswordField(true)}
                disabled={showNewPasswordField || !hasEditPermission}
              >
                Change password
              </Button>
            </FieldContainer>
          </Tooltip>
        )}

        {passwordDisplay === "new" && (
          <FieldContainer>
            <PasswordField
              data-testid={"password"}
              label={"Password"}
              value={user.password}
              disabled={disabled}
              showPassword={showPassword}
              onChange={(value) => {
                dispatch({
                  type: "update-password",
                  payload: { password: value }
                });
              }}
              onTogglePasswordVisibility={() => setShowPassword((cur) => !cur)}
            />
          </FieldContainer>
        )}
      </InlineFieldsContainer>

      {passwordDisplay === "update" && showNewPasswordField && (
        <FieldContainer ref={newPasswordRef}>
          <PasswordField
            data-testid={"new-password"}
            label={"New password"}
            value={user.password}
            disabled={disabled}
            showPassword={showPassword}
            onChange={(value) => {
              dispatch({
                type: "update-password",
                payload: { password: value }
              });
            }}
            onTogglePasswordVisibility={() => setShowPassword((cur) => !cur)}
          />
        </FieldContainer>
      )}
    </Box>
  );
}

type PasswordInputProps = {
  label: string;
  value: string;
  showPassword: boolean;
  disabled: boolean;
  onChange: (value: string) => void;
  onTogglePasswordVisibility: VoidFunction;
};

function PasswordField({
  label,
  value,
  showPassword,
  disabled,
  onChange,
  onTogglePasswordVisibility,
  ...rest
}: PasswordInputProps) {
  return (
    <>
      <InputLabel htmlFor={"manage-user-password"}>{label}</InputLabel>
      <TextField
        id={"manage-user-password"}
        autoComplete={"off"}
        type={showPassword ? "text" : "password"}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        helperText={"Must contain 8 characters."}
        InputProps={{
          endAdornment: (
            <InputAdornment position={"end"}>
              <IconButton
                disableRipple
                data-testid={"toggle-password-visibility"}
                onClick={onTogglePasswordVisibility}
                sx={{ p: 0, color: "#000" }}
              >
                {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
              </IconButton>
            </InputAdornment>
          )
        }}
        {...rest}
      />
    </>
  );
}

const _USER_ACCESS_ROW_OPTIONS_QUERY = gql`
  fragment ManageUserAccessApp on Application {
    id
    name
    status {
      isValid
    }
    roles {
      id
      name
    }
  }

  fragment ManageUserAccessSite on Site {
    id: idV2
    name
  }

  query userAccessRowOptions {
    applications {
      ...ManageUserAccessApp
    }
    sites {
      ...ManageUserAccessSite
    }
  }
`;

const _USERS = gql`
  query users {
    users {
      id
      firstName
      lastName
      accessLevel
    }
  }
`;

const _USER_CREATE_V2_MUTATION = gql`
  mutation userCreateV2($input: NewUserInputV2!) {
    userCreateV2(user: $input) {
      ...UserManagementUser
    },
    ${UserManagementUserFragmentDoc}
  }
`;

const _USER_UPDATE_MUTATION = gql`
  mutation userUpdate($input: UserProfileInput!) {
    userUpdate(user: $input) {
      ...UserManagementUser
    },
    ${UserManagementUserFragmentDoc}
  }
`;

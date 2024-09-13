import { useState } from "react";
import { UsersTable, UsersTableProps } from "../shared";
import { useImpersonateUserMutation } from "generated-graphql";
import { ImpersonateUserDialog } from "./impersonate-user-dialog";
import TheaterComedyRoundedIcon from "@mui/icons-material/TheaterComedyRounded";
import { UserActionFn } from "../../types";
import { UserManagementUserFragment } from "../../__generated__/users";
import { isNoAccessUser } from "../../../../../view/user/utils";

export function AdminUsersTableWrapper(props: UsersTableProps) {
  const [userToImpersonate, setUserToImpersoante] =
    useState<UserManagementUserFragment | null>(null);

  const [
    impersonateUser,
    { data: impersonateData, loading: impersoanteRunning, error: impersonateErr }
  ] = useImpersonateUserMutation();

  const impersonating = !!impersonateData?.sudoImpersonateUser || impersoanteRunning;
  const loading = !!props.loading;

  const actions: UserActionFn[] = [
    (user) => ({
      icon: () => <TheaterComedyRoundedIcon />,
      onClick: () => setUserToImpersoante(user),
      disabled:
        props.currentUser?.id === user.id ||
        loading ||
        impersonating ||
        isNoAccessUser(user.accessLevel),
      tooltip:
        props.currentUser?.id === user.id
          ? "Cannot impersonate yourself"
          : isNoAccessUser(user.accessLevel)
            ? "Can not impersonate a user with no application access"
            : "",
      buttonProps: { "data-testid": "impersonate-user" }
    }),
    ...props.actions
  ];

  async function onImpersonateConfirm(user: UserManagementUserFragment) {
    const redirectUrl = `${window.location.origin}/settings`;
    const { data } = await impersonateUser({
      variables: { userId: user.id, redirectUrl }
    });

    const redirectTo = data?.sudoImpersonateUser;
    if (!redirectTo) {
      throw Error("Impersonation Failed. No redirect URL.");
    }
    window.location.href = redirectTo;
  }

  if (impersonateErr) throw impersonateErr;

  return (
    <>
      <span data-testid={"admin-users-table-wrapper"} />
      {userToImpersonate && (
        <ImpersonateUserDialog
          user={userToImpersonate}
          onConfirm={onImpersonateConfirm}
          onCancel={() => setUserToImpersoante(null)}
          disabled={impersonating}
        />
      )}
      <UsersTable {...props} actions={actions} loading={loading} />
    </>
  );
}

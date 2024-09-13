import { useCallback, useEffect, useState } from "react";
import { UsersTable } from "./users-table";
import { sortUsers } from "./utils";
import { useCurrentUserQuery } from "generated-graphql";
import { NetworkStatus, gql } from "@apollo/client";
import {
  UserManagementUserFragment,
  useUserManagementUsersLazyQuery
} from "./__generated__/users";
import { UserActionFn } from "./types";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { ManageUserDialog } from "./manage-user-dialog";
import { UserActionType } from "../../../view/user/types";
import { canUser } from "../../../view/user/utils";
import { DeleteUserDialog } from "./delete-user-dialog";
import { UserManagement } from "./manage-user-dialog/types";
import { SomethingWentWrong } from "view-v2/page";

export function Users() {
  const [error, setError] = useState<Error | null>(null);
  const [ManageUser, setManageUser] = useState<UserManagement | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserManagementUserFragment | null>(
    null
  );

  const {
    data: curUserData,
    loading: curUserLoading,
    refetch: refetchCurrentUser
  } = useCurrentUserQuery({
    onError: setError,
    // ensure loading state is set true when refetching
    notifyOnNetworkStatusChange: true
  });
  const [
    loadUsers,
    { data: usersData, networkStatus: usersNetworkStatus, refetch: refetchUsers }
  ] = useUserManagementUsersLazyQuery({
    onError: setError,
    fetchPolicy: "cache-and-network"
  });

  useEffect(() => {
    loadUsers();
  }, []);

  function handleClickRefresh() {
    setError(null);
    refetchCurrentUser();
    loadUsers();
  }

  const userDetailsLoading = usersNetworkStatus === NetworkStatus.loading;
  const currentUser = curUserData?.currentUser;
  const users = usersData?.users;
  const sortUsersMemo = useCallback(sortUsers, [users, currentUser]);
  const loading = curUserLoading || userDetailsLoading;

  const actions: UserActionFn[] = [
    (user) => {
      const canEditUser =
        currentUser &&
        canUser(currentUser, {
          type: UserActionType.EDIT_USER,
          otherUser: user
        });

      return {
        icon: () => <EditRoundedIcon />,
        onClick: (_e, user) => {
          if (Array.isArray(user)) return;

          if (currentUser?.id === user.id) {
            setManageUser({ type: "update-own-user", user });
          } else {
            setManageUser({ type: "update-other-user", user });
          }
        },
        disabled: loading || !canEditUser,
        tooltip: !canEditUser
          ? "You don't have permission to edit this user. Please contact an Org Admin"
          : "",
        buttonProps: { "data-testid": "edit-user" }
      };
    },
    (user) => {
      const canDeleteUser = currentUser
        ? canUser(currentUser, {
            type: UserActionType.DELETE_USER,
            otherUserId: user.id
          })
        : false;

      return {
        icon: () => <DeleteRoundedIcon />,
        onClick: () => setUserToDelete(user),
        disabled: loading || !canDeleteUser,
        tooltip: !canDeleteUser
          ? currentUser?.id === user.id
            ? "You can not delete your own account"
            : "You don't have permission to delete this user. Please contact an Org Admin"
          : "",
        buttonProps: { "data-testid": "delete-user" }
      };
    }
  ];

  if (error) {
    return (
      <SomethingWentWrong
        data-testid={"users-table-error"}
        onClickRefresh={handleClickRefresh}
      />
    );
  }

  return (
    <div>
      {!!ManageUser && (
        <ManageUserDialog
          userManagement={ManageUser}
          onClose={() => {
            refetchUsers();
            setManageUser(null);
          }}
        />
      )}
      {userToDelete && (
        <DeleteUserDialog
          userToDelete={userToDelete}
          onClose={() => setUserToDelete(null)}
        />
      )}
      <span data-testid={"users"} />
      <UsersTable
        currentUser={currentUser ?? null}
        users={currentUser ? sortUsersMemo(currentUser, users || []) : []}
        loading={loading}
        actions={actions}
        onAddUserClick={() => setManageUser({ type: "create-user" })}
        canAddUser={
          currentUser ? canUser(currentUser, { type: UserActionType.ADD_USER }) : false
        }
      />
    </div>
  );
}

const _USER_MANAGEMENT_USERS_QUERY = gql`
  fragment UserManagementUser on User {
    id
    firstName
    lastName
    email
    phone
    accessLevel
    accessList {
      app {
        id
        name
      }
      role {
        id
        name
      }
      site {
        id: idV2
        name
      }
    }
    pdUserGroup {
      id
      name
    }
    pdHostMappings {
      id
      nativeHostId
    }
  }

  query userManagementUsers {
    users {
      ...UserManagementUser
    }
  }
`;

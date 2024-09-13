import { useApplicationSubscriptionsQuery, useCurrentUserQuery } from "generated-graphql";
import { isAdminBuild } from "../../utils";
import { canUser } from "../../view/user/utils";
import { UserActionType } from "../../view/user/types";
import { ApolloError } from "@apollo/client";
import { PD_SUITE_APP_IDS } from "../../view/utils";

type CheckResult = {
  canAccessUserManagementTabs: boolean;
  loading: boolean;
  error: ApolloError | undefined;
};

function useAdminValidation(): CheckResult {
  const { data: appsData, loading, error } = useApplicationSubscriptionsQuery();

  return {
    canAccessUserManagementTabs: !!appsData?.appSubscriptions.some(
      (app) => PD_SUITE_APP_IDS.includes(app.id) && app.subscription?.isValid
    ),
    loading,
    error
  };
}

function useAppValidation(): CheckResult {
  const { data: curUser, loading, error } = useCurrentUserQuery();
  const currentUser = curUser?.currentUser;

  return {
    canAccessUserManagementTabs:
      !!currentUser &&
      canUser(currentUser, {
        type: UserActionType.MANAGE_PD_SUITE
      }),
    loading,
    error
  };
}

/**
 * Check user has access to user management tabs; which is different checks depending on admin build vs app build
 */
export let useUserManagementPermission: () => CheckResult;
if (isAdminBuild()) {
  useUserManagementPermission = useAdminValidation;
} else {
  useUserManagementPermission = useAppValidation;
}

import { Box } from "@mui/material";
import { ReducerAccess, ReducerAction } from "./manage-user-reducer/types";
import {
  buildAppOptions,
  buildManagedSitesByApp,
  buildRoleOptions,
  buildSiteOptions,
  canEditAccessRow
} from "./utils";
import { GaUserFragment } from "generated-graphql";
import { Tooltip, Button } from "@vizexplorer/global-ui-v2";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { AccessListRow } from "./access-list-row";
import { memo } from "react";
import {
  ManageUserAccessAppFragment,
  ManageUserAccessSiteFragment
} from "./__generated__/manage-user-dialog";

type Props = {
  currentUser?: GaUserFragment | null;
  accessList: ReducerAccess[];
  apps: ManageUserAccessAppFragment[];
  sites: ManageUserAccessSiteFragment[];
  loadingOptions?: boolean;
  disabled?: boolean;
  dispatch: (value: ReducerAction) => void;
};

function AccessListComponent({
  currentUser,
  accessList,
  apps,
  sites,
  loadingOptions = false,
  disabled = false,
  dispatch
}: Props) {
  const managedSitesByApp = currentUser
    ? buildManagedSitesByApp(currentUser, apps, sites)
    : [];

  return (
    <Box data-testid={"access-list"}>
      <Box display={"flex"} flexDirection={"column"} rowGap={"24px"}>
        {accessList.map((access, idx) => {
          const appOptions = buildAppOptions(access, accessList, apps, managedSitesByApp);
          const siteOptions = buildSiteOptions(
            access,
            accessList,
            sites,
            managedSitesByApp
          );
          const roleOptions = buildRoleOptions(access, apps);
          const canEdit = !!currentUser && canEditAccessRow(currentUser, access);

          return (
            <Tooltip
              key={`access-row-${idx}`}
              title={
                !canEdit
                  ? "Unable to edit permissions for applications or properties you're not an administrator of"
                  : ""
              }
              followCursor
            >
              <span>
                <AccessListRow
                  rowIdx={idx}
                  selected={access}
                  applications={appOptions}
                  sites={siteOptions}
                  roles={roleOptions}
                  disabled={disabled || !canEdit}
                  loadingOptions={loadingOptions}
                  deletable={accessList.length > 1 || !!access.app?.id}
                  dispatch={dispatch}
                />
              </span>
            </Tooltip>
          );
        })}
      </Box>
      <Button
        disableRipple
        data-testid={"add-access-row-btn"}
        color={"neutral"}
        size={"small"}
        startIcon={<AddRoundedIcon />}
        disabled={disabled}
        onClick={() => {
          dispatch({ type: "add-empty-access-row" });
        }}
        sx={{ mt: "4px", fontSize: "14px" }}
      >
        Add another application, property and role
      </Button>
    </Box>
  );
}

export const AccessList = memo(AccessListComponent);

import { ReducerAccess, ReducerAction } from "./manage-user-reducer/types";
import { Box } from "@mui/material";
import { InputLabel } from "@vizexplorer/global-ui-v2";
import { Select } from "view-v2/select";
import { IconButton } from "view-v2/icon-button";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import {
  ManageUserAccessAppFragment,
  ManageUserAccessSiteFragment
} from "./__generated__/manage-user-dialog";

type Props = {
  rowIdx: number;
  selected: ReducerAccess;
  applications: ManageUserAccessAppFragment[];
  sites: ManageUserAccessSiteFragment[];
  roles: ManageUserAccessAppFragment["roles"];
  disabled?: boolean;
  deletable?: boolean;
  loadingOptions?: boolean;
  dispatch: (value: ReducerAction) => void;
};

export function AccessListRow({
  rowIdx,
  selected,
  applications,
  sites,
  roles,
  disabled = false,
  deletable = true,
  loadingOptions = false,
  dispatch
}: Props) {
  return (
    <Box
      data-testid={"access-list-row"}
      display={"grid"}
      gridTemplateColumns={"1fr 1fr 1fr max-content"}
      columnGap={"16px"}
      alignItems={"end"}
    >
      <Box>
        <InputLabel htmlFor={`manage-user-application-${rowIdx}`}>Application</InputLabel>
        <Select
          id={`manage-user-application-${rowIdx}`}
          data-testid={"application"}
          // @ts-ignore allow null
          value={selected.app?.id ?? null}
          options={applications.map((app) => app.id)}
          getOptionLabel={(id) => applications.find((app) => app.id === id)?.name ?? ""}
          loading={loadingOptions}
          disabled={disabled}
          placeholder={"Select application"}
          onChange={(_e, value) => {
            dispatch({
              type: "update-access-row-app",
              payload: { rowIdx, appId: value }
            });
          }}
        />
      </Box>

      <Box>
        <InputLabel htmlFor={`manage-user-property-${rowIdx}`}>Property</InputLabel>
        <Select
          id={`manage-user-property-${rowIdx}`}
          data-testid={"property"}
          // @ts-ignore allow null
          value={selected.site?.id ?? null}
          options={sites.map((site) => site.id)}
          getOptionLabel={(id) => sites.find((site) => site.id === id)?.name ?? ""}
          loading={loadingOptions}
          disabled={disabled}
          placeholder={"Select property"}
          onChange={(_e, value) => {
            dispatch({
              type: "update-access-row-site",
              payload: { rowIdx, siteId: value }
            });
          }}
        />
      </Box>

      <Box>
        <InputLabel htmlFor={`manage-user-role-${rowIdx}`}>Role</InputLabel>
        <Select
          id={`manage-user-role-${rowIdx}`}
          data-testid={"role"}
          // @ts-ignore allow null
          value={selected.role?.id ?? null}
          options={roles.map((role) => role.id)}
          getOptionLabel={(id) => roles.find((role) => role.id === id)?.name ?? ""}
          loading={loadingOptions}
          disabled={disabled}
          placeholder={"Select role"}
          onChange={(_e, value) => {
            dispatch({
              type: "update-access-row-role",
              payload: { rowIdx, roleId: value }
            });
          }}
        />
      </Box>

      <IconButton
        data-testid={"delete"}
        color={"neutral"}
        disabled={!deletable || disabled}
        onClick={() => {
          dispatch({
            type: "remove-access-row",
            payload: { rowIdx }
          });
        }}
        sx={{ mb: "2px" }}
      >
        <DeleteRoundedIcon />
      </IconButton>
    </Box>
  );
}

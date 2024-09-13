import { Column } from "@material-table/core";
import { Box } from "@mui/material";
import { UserDisplay } from "../../../view/user/utils";
import { Tooltip, Typography } from "@vizexplorer/global-ui-v2";
import { HostMappingUsersFragment } from "./__generated__/host-mapping";

const nameColumn: Column<HostMappingUsersFragment> = {
  title: "User",
  render: (user) => {
    return (
      <Box display={"grid"} gridAutoRows={"24px"} m={"8px 0"} alignItems={"center"}>
        <Tooltip
          title={UserDisplay.fullName(user.firstName, user.lastName)}
          placement={"top-start"}
        >
          <Typography noWrap data-testid={"user-fullname"} fontWeight={600}>
            {UserDisplay.fullName(user.firstName, user.lastName)}
          </Typography>
        </Tooltip>
        <Tooltip title={user.email} placement={"top-start"}>
          <Typography noWrap data-testid={"user-email"} variant="bodySmall">
            {user.email}
          </Typography>
        </Tooltip>
        <Tooltip title={user.phone} placement={"top-start"}>
          <Typography noWrap data-testid={"user-phone"} variant="bodySmall">
            {user.phone}
          </Typography>
        </Tooltip>
      </Box>
    );
  },
  customFilterAndSearch: (search, user) => {
    const normSearch = search.toLowerCase();
    const normName = UserDisplay.fullName(user.firstName, user.lastName).toLowerCase();
    return normName.includes(normSearch);
  },
  customSort: (userA, userB) => {
    const nameA = `${UserDisplay.fullName(userA.firstName, userA.lastName)}`;
    const nameB = `${UserDisplay.fullName(userB.firstName, userB.lastName)}`;

    return new Intl.Collator().compare(nameA, nameB);
  },
  width: "30%",
  defaultSort: "asc"
};

const hostCodes: Column<HostMappingUsersFragment> = {
  title: "Host codes",
  render: (mapping) => {
    return (
      <Typography data-testid={"host-codes"} variant="bodySmall">
        {mapping.pdHostMappings?.map((host) => host.nativeHostId).join(", ") ?? ""}
      </Typography>
    );
  },
  customFilterAndSearch: (search, user) => {
    if (!user.pdHostMappings) return false;

    return user.pdHostMappings.some((mapping) => mapping.nativeHostId.includes(search));
  },
  sorting: false
};

export function createHostMappingColumns(): Column<HostMappingUsersFragment>[] {
  return [nameColumn, hostCodes, { width: "auto" }];
}

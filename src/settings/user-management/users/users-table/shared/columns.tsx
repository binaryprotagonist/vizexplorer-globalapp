import { Column } from "@material-table/core";
import { Box, styled } from "@mui/material";
import { Button, ButtonProps, Tooltip, Typography } from "@vizexplorer/global-ui-v2";
import { UserManagementUserFragment } from "../../__generated__/users";
import { ArrayUtils } from "../../../../../view/utils/array";
import { UserDisplay, isNoAccessUser, isOrgAdmin } from "../../../../../view/user/utils";
import React from "react";

const AccessListBox = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "minmax(90px, 200px) minmax(50px, 120px) minmax(50px, 165px)",
  columnGap: theme.spacing(1)
}));

function TableButton({ children, ...rest }: ButtonProps) {
  return (
    <Button
      disableRipple
      size={"small"}
      sx={{ p: 0, minWidth: 0, fontSize: "14px" }}
      {...rest}
    >
      {children}
    </Button>
  );
}

const nameColumn: Column<UserManagementUserFragment> = {
  title: "Personal Information",
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
          <Typography noWrap variant="bodySmall" data-testid={"user-email"}>
            {user.email}
          </Typography>
        </Tooltip>
        <Tooltip title={user.phone} placement={"top-start"}>
          <Typography noWrap variant="bodySmall" data-testid={"user-phone"}>
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
  customSort: (userA, userB, _type, sortDirection) => {
    const nameA = `${UserDisplay.fullName(userA.firstName, userA.lastName)}`;
    const nameB = `${UserDisplay.fullName(userB.firstName, userB.lastName)}`;

    if (!userA.email && userB.email) return sortDirection === "asc" ? 1 : -1;
    if (userA.email && !userB.email) return sortDirection === "asc" ? -1 : 1;

    return new Intl.Collator().compare(nameA, nameB);
  },
  width: "20%"
};

function accessColumn(
  viewMoreAccessUserId: string | null
): Column<UserManagementUserFragment> {
  return {
    title: "Access",
    render: (user: UserManagementUserFragment) => {
      if (isOrgAdmin(user.accessLevel) || isNoAccessUser(user.accessLevel)) {
        return (
          <AccessListBox data-testid={"access-list"}>
            {UserDisplay.accessLevel(user.accessLevel)}
          </AccessListBox>
        );
      }

      const viewMore = viewMoreAccessUserId === user.id;
      const accessList = viewMore
        ? user.accessList
        : user.accessList.filter((_, idx) => idx < 3);
      return (
        <Box data-testid={"access-list"}>
          {accessList.map(({ app, role, site }, idx, thisArr) => {
            const hasMore = user.accessList.length > 3 && idx === 2;

            return (
              <React.Fragment key={`${user.id}-access-${idx}`}>
                <Tooltip
                  title={`${app.name} - ${role.name} - ${site.name}`}
                  placement={"top"}
                >
                  <AccessListBox data-testid={"access-row"}>
                    <Typography noWrap variant={"bodySmall"}>
                      {app.name}
                    </Typography>
                    <Typography noWrap variant={"bodySmall"}>
                      {role.name}
                    </Typography>
                    <Typography noWrap variant={"bodySmall"}>
                      {site.name}
                    </Typography>
                  </AccessListBox>
                </Tooltip>

                {!viewMore && hasMore && (
                  <TableButton id="access-see-all">See all</TableButton>
                )}
                {viewMore && idx === thisArr.length - 1 && (
                  <TableButton id="access-see-less">See less</TableButton>
                )}
              </React.Fragment>
            );
          })}
        </Box>
      );
    },
    customFilterAndSearch: (search, user) => {
      const normSearch = search.toLowerCase();
      const normAccessLevel = UserDisplay.accessLevel(user.accessLevel).toLowerCase();

      const matchAccessLevel = normAccessLevel.includes(normSearch);
      if (matchAccessLevel) return true;

      return user.accessList.some(({ app, role, site }) => {
        const normAccess = `${app.name}${role.name}${site.name}`.toLowerCase();
        return normAccess.includes(normSearch);
      });
    },
    sorting: false,
    width: "35%"
  };
}

const userGroup: Column<UserManagementUserFragment> = {
  title: "User group",
  field: "userGroup",
  render: (user) => (
    <Tooltip title={user.pdUserGroup?.name} placement={"top-start"}>
      <Typography noWrap data-testid={"user-group"} variant="bodySmall">
        {user.pdUserGroup?.name}
      </Typography>
    </Tooltip>
  ),
  customFilterAndSearch: (search, user) => {
    if (!user.pdUserGroup) return false;
    const normSearch = search.toLowerCase();
    return user.pdUserGroup.name.toLowerCase().includes(normSearch);
  },
  customSort: (userA, userB, _type, sortDirection) => {
    const nameA = userA.pdUserGroup?.name || "";
    const nameB = userB.pdUserGroup?.name || "";
    const emailA = userA.email;
    const emailB = userB.email;

    if (!emailA && emailB) return sortDirection === "asc" ? 1 : -1;
    if (emailA && !emailB) return sortDirection === "asc" ? -1 : 1;

    return new Intl.Collator().compare(nameA, nameB);
  },
  width: "18%"
};

function hostCodes(
  viewMoreHostCodesUserId: string | null
): Column<UserManagementUserFragment> {
  return {
    title: "Host codes",
    render: (user: UserManagementUserFragment) => {
      const hostCodes = (user.pdHostMappings ?? []).map(
        ({ nativeHostId }) => nativeHostId
      );
      const viewMore = viewMoreHostCodesUserId === user.id;
      const hostCodeChunks = ArrayUtils.chunkCeil(hostCodes, 3);
      const hostCodesList = viewMore
        ? hostCodeChunks
        : hostCodeChunks.filter((_, idx) => idx < 3);

      return (
        <Box data-testid={"host-code-list"}>
          {hostCodesList.map((codeChunk, idx, thisArr) => {
            const hasMore = hostCodeChunks.length > 3 && idx === 2;
            const formattedCodes = codeChunk.join(", ");

            return (
              <Box key={`${user.id}-host-codes-row-${idx}`}>
                <Box data-testid={"host-codes-row"}>
                  {formattedCodes}
                  {idx !== thisArr.length - 1 && ","}
                </Box>

                {!viewMore && hasMore && (
                  <TableButton id="host-codes-see-all">See all</TableButton>
                )}
                {viewMore && idx === thisArr.length - 1 && (
                  <TableButton id="host-codes-see-less">See less</TableButton>
                )}
              </Box>
            );
          })}
        </Box>
      );
    },
    customFilterAndSearch: (search, user) => {
      if (!user.pdHostMappings?.length) return false;

      const normSearch = search.toLowerCase();
      return user.pdHostMappings.some(({ nativeHostId }) =>
        nativeHostId.includes(normSearch)
      );
    },
    sorting: false,
    width: "25%"
  };
}

export function createUserColumns(
  viewMoreAccessUserId: string | null,
  viewMoreHostCodesUserId: string | null
): Column<UserManagementUserFragment>[] {
  return [
    nameColumn,
    accessColumn(viewMoreAccessUserId),
    userGroup,
    hostCodes(viewMoreHostCodesUserId),
    // empty column to preserve column positions/spacing for larger screens
    { width: "auto" }
  ];
}

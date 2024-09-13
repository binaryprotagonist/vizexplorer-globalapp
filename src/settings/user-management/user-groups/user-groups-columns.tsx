import { Column } from "@material-table/core";
import { Box, styled } from "@mui/material";
import { TableButton } from "../../../view/table";
import { UserDisplay } from "../../../view/user/utils";
import { booleanAsYesNo, guestInteractionLabel } from "./utils";
import { UserGroupFragment } from "./__generated__/user-groups";
import { Typography } from "@vizexplorer/global-ui-v2";

const groupName: Column<UserGroupFragment> = {
  title: "Group name",
  render: (group) => {
    return (
      <Typography data-testid={"group-name"} variant="bodySmall" fontWeight={600}>
        {group.name}
      </Typography>
    );
  },
  customFilterAndSearch: (search: string, group) =>
    group.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
  customSort: (groupA, groupB) => {
    return new Intl.Collator().compare(groupA.name, groupB.name);
  },
  width: "auto",
  defaultSort: "asc"
};

const guestInteraction: Column<UserGroupFragment> = {
  title: "Guest interaction",
  render: (group) => (
    <Typography data-testid={"guest-interaction"} variant="bodySmall">
      {guestInteractionLabel(group.guestInteractionType)}
    </Typography>
  ),
  customFilterAndSearch: (search: string, group) => {
    return guestInteractionLabel(group.guestInteractionType)
      .toLocaleLowerCase()
      .includes(search.toLocaleLowerCase());
  },
  customSort: (groupA, groupB) => {
    return new Intl.Collator().compare(
      guestInteractionLabel(groupA.guestInteractionType),
      guestInteractionLabel(groupB.guestInteractionType)
    );
  },
  width: "auto"
};

const greetsAssignment: Column<UserGroupFragment> = {
  title: "Greets assignment",
  render: (group) => (
    <Typography data-testid={"greets-assignment"} variant="bodySmall">
      {booleanAsYesNo(!!group.guestInteractionType)}
    </Typography>
  ),
  customFilterAndSearch: (search: string, group) => {
    return booleanAsYesNo(!!group.guestInteractionType)
      .toLocaleLowerCase()
      .includes(search.toLocaleLowerCase());
  },
  customSort: (groupA, groupB) => {
    return groupA.guestInteractionType ? -1 : groupB.guestInteractionType ? 1 : 0;
  },
  width: "auto"
};

const includeInReports: Column<UserGroupFragment> = {
  title: "Include in reports",
  render: (data) => (
    <Typography data-testid={"include-reports"} variant="bodySmall">
      {booleanAsYesNo(!data.excludeFromReports)}
    </Typography>
  ),
  customFilterAndSearch: (search: string, group) => {
    return booleanAsYesNo(group.excludeFromReports)
      .toLocaleLowerCase()
      .includes(search.toLocaleLowerCase());
  },
  customSort: (groupA, groupB) => {
    return groupA.excludeFromReports ? -1 : groupB.excludeFromReports ? 1 : 0;
  },
  width: "auto"
};

const UserOverflowBox = styled(Box)({
  display: "flex",
  overflow: "hidden",
  whiteSpace: "normal",
  textOverflow: "ellipsis"
});
const MAX_COLLAPSED_USERS = 3;

function users(viewMoreGroupId: string | null): Column<UserGroupFragment> {
  return {
    title: "Users",
    render: (data) => {
      const viewMore = viewMoreGroupId === data.id;
      const usersToDisplay = viewMore
        ? data.members
        : data.members.slice(0, MAX_COLLAPSED_USERS);
      const usersNames = usersToDisplay.map((user) =>
        UserDisplay.fullName(user.firstName, user.lastName)
      );

      return (
        <Box data-testid={"user-list"} display={"grid"} rowGap={"4px"}>
          <UserOverflowBox>
            <Typography data-testid={"users"} variant="bodySmall">
              {usersNames.join(", ")}
            </Typography>
          </UserOverflowBox>
          {data.members.length > MAX_COLLAPSED_USERS && (
            <TableButton
              data-testid={"toggle-view-usernames"}
              sx={{ padding: 0 }}
              disableRipple
            >
              {viewMore ? "See less" : "See all"}
            </TableButton>
          )}
        </Box>
      );
    },
    customFilterAndSearch: (search: string, group) => {
      return group.members.some(({ firstName, lastName }) =>
        UserDisplay.fullName(firstName, lastName)
          .toLocaleLowerCase()
          .includes(search.toLocaleLowerCase())
      );
    },
    sorting: false,
    width: "30%"
  };
}

export function createUserGroupColumns(
  viewMoreGroupId: string | null
): Column<UserGroupFragment>[] {
  return [
    groupName,
    greetsAssignment,
    includeInReports,
    guestInteraction,
    users(viewMoreGroupId)
  ];
}

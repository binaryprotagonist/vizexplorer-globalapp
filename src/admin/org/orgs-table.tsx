import { useMemo } from "react";
import { Table } from "view-v2/table";
import { Action, Column } from "@material-table/core";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Button, Typography } from "@vizexplorer/global-ui-v2";
import { OrgSummaryFragment } from "./__generated__/org-selection";
import { TableContainer } from "view-v2/table/table-container";
import { TableToolbarContainer } from "view-v2/table/toolbar";
import { Search } from "../../settings/common";
import { ActionEvt } from "./types";

type Props = {
  orgs: OrgSummaryFragment[];
  disabled?: boolean;
  loading: boolean;
  searchText: string;
  showAddOrganization?: boolean;
  onSearchChange: (search: string) => void;
  onActionClick: (evt: ActionEvt) => void;
};

type OrgSummaryActionFn = (rowData: OrgSummaryFragment) => Action<OrgSummaryFragment>;

export function OrgsTable({
  orgs,
  disabled = false,
  loading,
  searchText,
  showAddOrganization = true,
  onSearchChange,
  onActionClick
}: Props) {
  const actions: OrgSummaryActionFn[] = [
    (org: OrgSummaryFragment) => ({
      icon: "Access",
      buttonProps: {
        "data-testid": "access-org-btn",
        variant: "outlined",
        color: "neutral"
      },
      onClick: () =>
        onActionClick({
          type: "access",
          value: { orgId: org.id, orgName: org.company?.name || "" }
        }),
      disabled: loading
    })
  ];
  const columns: Column<OrgSummaryFragment>[] = useMemo(
    () => [
      {
        title: "Organization name",
        render: ({ company }) => (
          <Typography
            noWrap
            data-testid={"company-name"}
            variant="bodySmall"
            fontWeight={600}
          >
            {company?.name}
          </Typography>
        ),
        customFilterAndSearch: () => true,
        width: "45%"
      },
      {
        title: "Contact Email",
        render: ({ company }) => (
          <Typography data-testid={"company-email"} variant="bodySmall">
            {company?.email}
          </Typography>
        ),
        customFilterAndSearch: () => true,
        sorting: false,
        width: "45%"
      }
    ],
    []
  );

  return (
    <TableContainer data-testid={"org-table"}>
      <TableToolbarContainer>
        <Search
          value={searchText}
          disabled={disabled}
          placeholder={"Search"}
          onChange={(e) => onSearchChange(e.target.value)}
          onClickClose={() => onSearchChange("")}
        />
        {showAddOrganization && (
          <Button
            disabled={disabled}
            size={"small"}
            variant={"contained"}
            startIcon={<AddRoundedIcon />}
            onClick={() => onActionClick({ type: "new" })}
          >
            Add organization
          </Button>
        )}
      </TableToolbarContainer>
      <Table
        loading={loading}
        columns={columns}
        actions={actions}
        data={orgs}
        options={{
          tableLayout: "fixed",
          ...(!loading && { rowStyle: { height: "70px" } })
        }}
        toolbar={{ type: "external" }}
      />
    </TableContainer>
  );
}

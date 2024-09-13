import { Column, MTableBodyRow } from "@material-table/core";
import { BasicAction, BasicMaterialTable } from "../../view/table";
import { ActionEventFn, ActionType, SiteAction, SiteWithTzLabel } from "./types";
import { GaUserFragment, SiteFragment } from "generated-graphql";
import { CenteredCell, TableContainer } from "../common";
import { canUser } from "../../view/user/utils";
import { UserActionType } from "../../view/user/types";
import { Box } from "@mui/material";
import { isAdminBuild } from "../../utils";
import timezones from "../../view/utils/timezones";
import { useMemo } from "react";
import { displayCurrency } from "../../view/utils/currency";

function tableColumns(): Column<SiteWithTzLabel>[] {
  const columns: Column<SiteWithTzLabel>[] = [
    {
      title: "Property Name",
      field: "name",
      defaultSort: "asc",
      width: "200px"
    },
    {
      title: "Currency Symbol",
      // use grid display to match header (title + sort arrow) so they center align together
      render: (site) => (
        <Box display={"grid"} gridTemplateColumns={"auto 26px"}>
          {displayCurrency(site.currency?.code)}
        </Box>
      ),
      customSort: (site1, site2) => {
        const site1Currency = displayCurrency(site1.currency?.code);
        const site2Currency = displayCurrency(site2.currency?.code);
        return site1Currency.localeCompare(site2Currency);
      },
      customFilterAndSearch: (search: string, site) => {
        const currency = displayCurrency(site.currency?.code);
        return currency.toLowerCase().includes(search.toLowerCase());
      },
      width: "200px",
      cellStyle: { textAlign: "center" },
      headerStyle: { textAlign: "center" }
    },
    {
      title: "Time Zone",
      field: "tzLabel",
      defaultSort: "asc"
    },
    {
      width: "auto"
    }
  ];

  if (isAdminBuild()) {
    columns.unshift({
      title: "Property ID",
      render: (site) => <CenteredCell>{site.id}</CenteredCell>,
      width: "200px",
      cellStyle: { textAlign: "center" },
      headerStyle: { textAlign: "center" }
    });
  }

  return columns;
}

function disabledEditReasoning(user: GaUserFragment): string {
  if (!canUser(user, { type: UserActionType.MANAGE_PROPERTIES })) {
    return "You don't have permissions to edit this property. Please contact an Org Admin";
  }

  return "";
}

function disableDeleteReasoning(
  user: GaUserFragment,
  properties: SiteFragment[]
): string {
  if (!canUser(user, { type: UserActionType.MANAGE_PROPERTIES })) {
    return "You don't have permission to delete this property. Please contact an Org Admin";
  }

  if (properties.length === 1) {
    return "Your organization should have at least one property";
  }

  return "";
}

type Props = {
  currentUser: GaUserFragment;
  properties: SiteFragment[];
  companyName: string;
  onActionClick: ActionEventFn;
};

export function PropertiesTable({
  currentUser,
  properties,
  companyName,
  onActionClick
}: Props) {
  const { columns, actions } = useMemo<{
    columns: Column<SiteWithTzLabel>[];
    actions: SiteAction[];
  }>(() => {
    return {
      columns: tableColumns(),
      actions: [
        (site) => ({
          icon: "Edit",
          onClick: () => onActionClick(ActionType.EDIT, site),
          tooltip: disabledEditReasoning(currentUser),
          disabled: !!disabledEditReasoning(currentUser)
        }),
        (site) => ({
          icon: "Delete",
          onClick: () => {
            if (properties.length === 1) return;
            onActionClick(ActionType.DELETE, site);
          },
          tooltip: disableDeleteReasoning(currentUser, properties),
          disabled: !!disableDeleteReasoning(currentUser, properties)
        })
      ]
    };
  }, []);
  const propertiesWithTzLabel: SiteWithTzLabel[] = useMemo(() => {
    return properties.map((site) => ({
      ...site,
      tzLabel: timezones.find((tz) => tz.tzCode === site.tz)?.label ?? "Unknown"
    }));
  }, [properties]);

  return (
    <>
      <span data-testid={"properties-table"} />
      <BasicMaterialTable
        components={{
          Container: TableContainer,
          Action: BasicAction,
          Row: (props) => <MTableBodyRow data-testid="property-row" {...props} />
        }}
        title={`${companyName} Properties`}
        columns={columns}
        data={propertiesWithTzLabel}
        actions={actions}
        options={{
          actionsColumnIndex: -1,
          emptyRowsWhenPaging: false,
          draggable: false
        }}
        localization={{
          header: {
            actions: ""
          }
        }}
      />
    </>
  );
}

import { useMemo, useState } from "react";
import { Action, Column, MTableBodyRow } from "@material-table/core";
import { ActionProps, BasicAction, BasicMaterialTable } from "../../../view/table";
import { Box, Skeleton } from "@mui/material";
import { CenteredCell, TableContainer } from "../../common";
import { ManagePdreRuleDialog } from "./dialog";
import { GaUserFragment, PdreRuleFragment, SiteFragment } from "generated-graphql";
import { canUserPdre } from "../utils";
import { UserActionTypePd } from "../types";

type Props = {
  currentUser: GaUserFragment | null;
  site: SiteFragment | null;
  rules: PdreRuleFragment[];
  loading: boolean;
};

export function PdreRulesTable({ currentUser, site, rules, loading }: Props) {
  const [editRule, setEditRule] = useState<PdreRuleFragment | null>(null);

  const actions: ((rule: PdreRuleFragment) => Action<PdreRuleFragment>)[] = [
    (rule) => {
      const disabled =
        !currentUser ||
        !site ||
        !canUserPdre(currentUser, {
          type: UserActionTypePd.EDIT_RULE,
          siteId: site.id
        });

      return {
        icon: "Edit",
        onClick: () => setEditRule(rule),
        disabled: loading || disabled,
        tooltip: disabled
          ? "You don't have permission to Edit Rules. Please contact an Org Admin"
          : ""
      };
    }
  ];

  // prevent material-table warning by not changing function object on re-render
  const columns: Column<PdreRuleFragment>[] = useMemo(
    () => [
      {
        field: "id",
        hidden: true,
        searchable: false,
        defaultSort: "asc"
      },
      {
        title: "Rule Name",
        field: "name",
        width: "25%"
      },
      {
        title: "Description",
        field: "description",
        sorting: false,
        width: "40%"
      },
      {
        title: "Weighting",
        render: (rule: PdreRuleFragment) => (
          <CenteredCell>{rule.config?.weight || 0}</CenteredCell>
        ),
        customSort: (r1: PdreRuleFragment, r2: PdreRuleFragment) => {
          const weight1 = r1.config?.weight || 0;
          const weight2 = r2.config?.weight || 0;
          if (weight1 === weight2) return 0;
          return weight1 > weight2 ? 1 : -1;
        },
        cellStyle: { textAlign: "center" },
        headerStyle: { textAlign: "center" },
        width: "10%"
      },
      {
        title: "Enabled",
        render: (rule: PdreRuleFragment) => (
          <CenteredCell>{rule.config?.enabled ? "Yes" : "No"}</CenteredCell>
        ),
        customSort: (r1: PdreRuleFragment, r2: PdreRuleFragment) => {
          const e1 = r1.config?.enabled || 0;
          const e2 = r2.config?.enabled || 0;
          return e1 === e2 ? 0 : e1 > e2 ? 1 : -1;
        },
        cellStyle: { textAlign: "center" },
        headerStyle: { textAlign: "center" },
        width: "10%"
      },
      { sorting: false }
    ],
    []
  );

  if (loading) return <LoadingTable />;

  return (
    <>
      <span data-testid={"pdre-rules-table"} />
      {editRule && (
        <ManagePdreRuleDialog rule={editRule} onClose={() => setEditRule(null)} />
      )}
      <BasicMaterialTable
        components={{
          Container: (props: any) => <TableContainer {...props} elevation={0} />,
          Action: (props: ActionProps<PdreRuleFragment>) => <BasicAction {...props} />,
          Row: (props) => <MTableBodyRow data-testid={"pdre-rule-row"} {...props} />
        }}
        columns={columns}
        data={rules}
        actions={actions}
        options={{
          actionsColumnIndex: -1,
          emptyRowsWhenPaging: false,
          draggable: false,
          showTitle: false,
          idSynonym: "id",
          rowStyle: {
            height: "73px"
          }
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

function LoadingTable() {
  return (
    <Box data-testid={"pdre-rules-table-loading"} marginTop={"12px"} padding={"18px"}>
      <Skeleton
        variant={"rectangular"}
        width={260}
        height={40}
        sx={{ margin: "0 18px 18px auto" }}
      />
      <Skeleton variant={"rectangular"} width={"100%"} height={200} />
    </Box>
  );
}

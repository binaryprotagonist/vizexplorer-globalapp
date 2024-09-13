import { useGlobalTheme } from "@vizexplorer/global-ui-v2";
import { useMemo } from "react";
import { DataGrid, Column } from "view-v2/data-grid";
import { GoalTargetValues } from "./manage-goal/manage-goal-reducer";
import { UserDisplay } from "../../view/user/utils";
import { gql } from "@apollo/client";
import {
  TargetValuesMetricFragment,
  TargetValuesUserFragment
} from "./__generated__/target-values-grid";
import { MAX_GOAL_VALUE, MIN_GOAL_VALUE } from "./utils";

type TargetValuesRowData = {
  id: string;
  fullName: string;
  values: (number | null)[];
};

type Props = {
  users: TargetValuesUserFragment[];
  metrics: TargetValuesMetricFragment[];
  targetValues: GoalTargetValues;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (params: { colIdx: number; rowIdx: number; value: string }) => void;
};

export function TargetValuesGrid({
  users,
  metrics,
  targetValues,
  disabled = false,
  readOnly = false,
  onChange
}: Props) {
  const globalTheme = useGlobalTheme();

  const rows = useMemo(() => {
    const totalRow: TargetValuesRowData = {
      id: "total",
      fullName: "TOTAL",
      values: calculateTotals(users, metrics, targetValues)
    };
    const userRows = users.map<TargetValuesRowData>((user, userIdx) => ({
      id: user.id,
      fullName: UserDisplay.fullNameV2(user),
      values: metrics.map((_, metricIdx) => targetValues[userIdx][metricIdx] ?? null)
    }));

    return [totalRow, ...userRows];
  }, [users, metrics, targetValues]);

  const columns: Column<TargetValuesRowData>[] = useMemo(
    () => [
      { headerName: "Users", field: "fullName" },
      ...metrics.map<Column<TargetValuesRowData>>((metric, idx) => ({
        field: metric.name,
        headerName: metric.name,
        type: "number",
        valueGetter: ({ row }) => {
          return row.values[idx] !== null ? `${row.values[idx]}` : "";
        },
        valuePlaceholder: ({ id }) => (id !== "total" ? "Enter goal" : null),
        valueParser: (value) => {
          const greaterThanMax = Number(value) > MAX_GOAL_VALUE;
          const lessThanMin = Number(value) < MIN_GOAL_VALUE;
          return greaterThanMax
            ? `${MAX_GOAL_VALUE}`
            : lessThanMin
              ? `${MIN_GOAL_VALUE}`
              : value;
        }
      }))
    ],
    [metrics]
  );

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      pinnedColumns={{ field: "fullName" }}
      pinnedRows={{ top: 1 }}
      maxRows={10}
      cellStyle={(params) => {
        const { row, column } = params ?? {};
        if (column?.field === "fullName") {
          return {
            fontWeight: 600,
            ...(disabled && {
              backgroundColor: globalTheme.colors.grey[50]
            }),
            ...(row?.id !== "total" && {
              backgroundColor: globalTheme.colors.vizPrimary[50]
            })
          };
        }

        return {
          ...(disabled && {
            backgroundColor: globalTheme.colors.grey[50]
          })
        };
      }}
      isCellEditable={({ row, column }) => {
        if (readOnly || disabled) return false;
        return row.id !== "total" && column.field !== "fullName";
      }}
      onCellValueChange={({ row, column, value }) => {
        const colIdx = columns.findIndex((colDef) => colDef.field === column.field);
        const rowIdx = rows.findIndex((rowDef) => rowDef.id === row.id);

        // Adjust cell index to align with Target Values index. Column[0] is Users and Row[0] is Total, which aren't included in the target values
        onChange?.({
          colIdx: colIdx - 1,
          rowIdx: rowIdx - 1,
          value
        });
      }}
    />
  );
}

TargetValuesGrid.fragments = {
  user: gql`
    fragment TargetValuesUser on User {
      id
      firstName
      lastName
      pdUserGroup {
        id
        name
      }
    }
  `,
  metric: gql`
    fragment TargetValuesMetric on PdGoalProgramMetric {
      id
      name
    }
  `,
  targetMatrix: gql`
    fragment TargetValuesTargetMatrix on PdGoalProgramTargetMatrix {
      matrix
    }
  `
};

function calculateTotals(
  users: TargetValuesUserFragment[],
  metrics: TargetValuesMetricFragment[],
  targetValues: GoalTargetValues
): number[] {
  return metrics.map((_, metricIdx) => {
    return users.reduce((acc, _, userIdx) => {
      const value = targetValues[userIdx][metricIdx];
      return acc + (value ?? 0);
    }, 0);
  });
}

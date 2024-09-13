import styled from "@emotion/styled";
import { MouseEvent } from "react";
import { Tooltip } from "@mui/material";
import { TableButton } from "./button";
import { Action } from "@material-table/core";
import { ButtonProps } from "@vizexplorer/global-ui-v2";

declare module "@material-table/core" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface Action<RowData extends object> {
    buttonProps?: ButtonProps & { "data-testid"?: string };
  }
}

const EmptySpan = styled("span")({
  width: "65px",
  height: "auto"
});

/**
 * material-table doesn't seem to have type definition for this
 * definition is based on observation and may be incomplete
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type ActionProps<RowData extends object> = {
  action: {
    action: ((data: RowData) => Action<RowData>) | Action<RowData>;
  };
  data: RowData & { tableData: any };
  disabled: boolean;
  size: string;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export function BasicAction<T extends object>(props: ActionProps<T>) {
  const action = props.action.action;
  const rowData: Action<T> = typeof action === "function" ? action(props.data) : action;

  if (!rowData) return null;
  if (rowData.hidden) return <EmptySpan />;

  function handleOnClick(event: MouseEvent<HTMLElement>) {
    if (rowData?.onClick) {
      rowData.onClick(event, props.data);
      event.stopPropagation();
    }
  }

  // New design guide color prop is not supported for old design components
  const { color, ...restBtnProps } = rowData.buttonProps ?? {};
  if (color === "neutral") {
    throw Error("'neutral' not supported");
  }

  return (
    <Tooltip
      data-testid={"action-tooltip"}
      title={rowData.tooltip || ""}
      placement={"top"}
    >
      <span>
        <TableButton
          sx={{ padding: 0 }}
          color={color ?? "primary"}
          disabled={rowData.disabled}
          disableRipple
          onClick={handleOnClick}
          {...restBtnProps}
        >
          {typeof rowData.icon === "function"
            ? rowData.icon(rowData.iconProps as any)
            : rowData.icon}
        </TableButton>
      </span>
    </Tooltip>
  );
}

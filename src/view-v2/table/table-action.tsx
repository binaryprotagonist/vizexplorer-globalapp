import { MouseEvent, useMemo } from "react";
import { Action } from "@material-table/core";
import { Button, Tooltip } from "@vizexplorer/global-ui-v2";
import { TableActionDef } from "./types";
import { IconButton } from "view-v2/icon-button";

type ActionProps<RowData extends object> = {
  action: TableActionDef<RowData>;
  data: RowData & { tableData: any };
  disabled: boolean;
  size: string;
};

export function TableAction<T extends object>(props: ActionProps<T>) {
  const action: Action<T> =
    "action" in props.action
      ? props.action.action(props.data)
      : typeof props.action === "function"
        ? props.action(props.data)
        : props.action;

  const TableButton = useMemo(() => {
    return typeof action.icon === "string" ? Button : IconButton;
  }, [action.icon]);

  if (action.hidden) {
    return null;
  }

  function handleOnClick(event: MouseEvent<HTMLElement>) {
    action.onClick(event, props.data);
    event.stopPropagation();
  }

  return (
    <Tooltip
      data-testid={"action-tooltip"}
      title={action.tooltip || ""}
      placement={"top"}
    >
      <span>
        <TableButton
          disableRipple
          size={"small"}
          disabled={action.disabled}
          onClick={handleOnClick}
          {...action.buttonProps}
          sx={{ color: "#000", ...action.buttonProps?.sx }}
        >
          {!action.icon ? null : typeof action.icon === "function" ? (
            action.icon(action.iconProps as any)
          ) : typeof action.icon === "string" ? (
            action.icon
          ) : (
            // @ts-ignore https://github.com/material-table-core/core/blob/9bd189a453bb7bba48b9c8c1309a36e47cd74307/src/components/MTableAction/index.js#L46-L59
            <action.icon {...action.iconProps} />
          )}
        </TableButton>
      </span>
    </Tooltip>
  );
}

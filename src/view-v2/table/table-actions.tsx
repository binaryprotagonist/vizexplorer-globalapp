import { Components } from "@material-table/core";
import { TableActionDef } from "./types";
import React from "react";
import { styled } from "@mui/material";

const ActionsContainer = styled("div")({
  display: "flex",
  justifyContent: "flex-end",
  columnGap: "8px",
  margin: "0 8px"
});

type TableActionProps<RowData extends object> = {
  actions: TableActionDef<RowData>[];
  components: Components;
  data: RowData[];
  size: string;
  disabled: boolean;
  forwardedRef: React.Ref<HTMLDivElement>;
};

function TableActions<RowData extends object>({
  actions,
  components,
  data,
  size,
  disabled,
  forwardedRef
}: TableActionProps<RowData>) {
  if (!actions) {
    return null;
  }

  return (
    <ActionsContainer ref={forwardedRef}>
      {actions.map((action, index) => (
        // @ts-ignore
        <components.Action
          action={action}
          key={"action-" + index}
          data={data}
          size={size}
          disabled={disabled}
        />
      ))}
    </ActionsContainer>
  );
}

export default React.forwardRef(function TableActionsRef<RowData extends object>(
  props: TableActionProps<RowData>,
  ref: React.Ref<HTMLDivElement>
) {
  return <TableActions {...props} forwardedRef={ref} />;
});

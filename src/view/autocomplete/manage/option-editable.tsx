import { HTMLAttributes } from "react";
import styled from "@emotion/styled";
import { Box, Button, Typography } from "@mui/material";

const Label = styled(Typography)({
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis"
});

type Props = HTMLAttributes<HTMLLIElement> & {
  value: string;
  onBtnClick: VoidFunction;
};

export function OptionEditable({ value, onBtnClick, ...liProps }: Props) {
  return (
    <li {...liProps} style={{ padding: "0 16px", margin: "4px 0" }}>
      <Box display={"flex"} alignItems={"center"} width={"100%"}>
        <Label>{value}</Label>
        <Button
          data-testid={"option-editable-btn"}
          sx={{ marginLeft: "auto", textTransform: "none" }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onBtnClick();
          }}
        >
          Edit
        </Button>
      </Box>
    </li>
  );
}

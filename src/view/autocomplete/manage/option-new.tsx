import { HTMLAttributes } from "react";
import styled from "@emotion/styled";
import { Box, Button, Divider } from "@mui/material";

const OptionNewBtn = styled(Button)({
  justifyContent: "flex-start",
  paddingLeft: 0,
  textTransform: "none",
  color: "inherit",
  fontSize: "1rem",
  fontWeight: 400,
  "&:hover": {
    background: "none"
  }
});

type NewConnectorProps = HTMLAttributes<HTMLLIElement> & {
  value: string;
  onBtnClick: VoidFunction;
};

export function OptionNew({ value, onBtnClick, ...liProps }: NewConnectorProps) {
  return (
    <>
      <Divider
        sx={{
          borderStyle: "dashed",
          borderBottomWidth: "2px",
          margin: "0 16px"
        }}
      />
      <li {...liProps} style={{ padding: "0 16px", margin: "4px 0" }}>
        <Box width={"100%"}>
          <OptionNewBtn
            data-testid={"option-new-btn"}
            fullWidth
            disableRipple
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onBtnClick();
            }}
          >
            {value}
          </OptionNewBtn>
        </Box>
      </li>
    </>
  );
}

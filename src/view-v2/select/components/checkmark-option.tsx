import { ReactNode } from "react";
import { Box } from "@mui/material";
import { Typography } from "@vizexplorer/global-ui-v2";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

type Props = React.HTMLAttributes<HTMLLIElement> & {
  option: ReactNode;
  selected?: boolean;
  startAdornment?: ReactNode;
};

export function CheckmarkOption({ option, selected, startAdornment, ...rest }: Props) {
  return (
    <li {...rest} style={{ minHeight: "50px", alignItems: "center" }}>
      {startAdornment}
      <Box m={"0 auto 0 8px"}>
        {typeof option === "string" ? (
          <Typography variant={"bodySmall"}>{option}</Typography>
        ) : (
          option
        )}
      </Box>
      {selected && <CheckRoundedIcon />}
    </li>
  );
}

import { Paper, PaperProps } from "@vizexplorer/global-ui-v2";

type Props = PaperProps;

export function TableContainer({ children, sx, ...rest }: Props) {
  return (
    <Paper
      data-testid={"table-container"}
      elevation={2}
      borderStyle={2}
      sx={{
        minWidth: "680px",
        height: "max-content",
        // prevent content clipping the border radius when `customToolbar` returns null
        overflow: "hidden",
        ...sx
      }}
      {...rest}
    >
      {children}
    </Paper>
  );
}

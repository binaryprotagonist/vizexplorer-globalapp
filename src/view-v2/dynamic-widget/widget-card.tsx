import { styled } from "@mui/material";
import { Paper, PaperProps } from "@vizexplorer/global-ui-v2";

type AdditionalProps = {
  height: string | number;
};

const StyledPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "height"
})<AdditionalProps>(({ height }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",
  height: typeof height === "number" ? `${height}px` : height
}));

type Props = AdditionalProps & PaperProps;

export function WidgetCard({ children, ...rest }: Props) {
  return <StyledPaper {...rest}>{children}</StyledPaper>;
}

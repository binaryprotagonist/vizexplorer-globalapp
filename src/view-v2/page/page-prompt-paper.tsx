import { styled } from "@mui/material";
import { Paper, PaperProps } from "@vizexplorer/global-ui-v2";

// Paper wrapper for page prompts (i.e no site selection, no search results, etc.)
const StyledPaper = styled(Paper)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "40vh",
  minHeight: "300px",
  overflow: "hidden"
});

export function PagePromptPaper(props: PaperProps) {
  return <StyledPaper elevation={2} borderStyle={2} {...props} />;
}

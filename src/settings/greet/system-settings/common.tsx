import { Box, styled } from "@mui/material";
import { Paper, Typography, useGlobalTheme } from "@vizexplorer/global-ui-v2";
import { HelpTip } from "view-v2/help-tip";

type Props = {
  title: string;
  helpText: JSX.Element | string;
  children?: React.ReactNode;
};

export function SettingsCard({ title, helpText, children, ...rest }: Props) {
  return (
    <Paper
      data-testid={"setting-card"}
      sx={{ display: "flex", p: "22px 24px", overflow: "hidden" }}
      {...rest}
    >
      <Box display={"flex"} alignItems={"center"} minWidth={"max-content"}>
        <Typography fontWeight={600}>{title}</Typography>
        <HelpTip data-testid={"help-tip"} title={helpText} placement={"right"} />
      </Box>
      {children}
    </Paper>
  );
}

export function CategoryLabel({ children }: { children: React.ReactNode }) {
  const theme = useGlobalTheme();

  return (
    <Typography color={theme.colors.grey[600]} variant={"label"}>
      {children}
    </Typography>
  );
}

export const SettingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  rowGap: "12px",
  marginTop: theme.spacing(1.5)
}));

export const SettingContent = styled(Box)({
  display: "flex",
  width: "100%",
  marginLeft: "100px",
  justifyContent: "end"
});

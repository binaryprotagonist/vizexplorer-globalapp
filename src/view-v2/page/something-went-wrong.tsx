import { Button, Typography, useGlobalTheme } from "@vizexplorer/global-ui-v2";
import { TwoToneCircleIcon } from "view-v2/two-tone-circle-icon";
import { VIZ_SUPPORT_LINK } from "view-v2/support";
import PriorityHighRoundedIcon from "@mui/icons-material/PriorityHighRounded";
import { Box, PaperProps, useTheme } from "@mui/material";
import { PagePromptPaper } from "./page-prompt-paper";

type Props = {
  onClickRefresh: VoidFunction;
} & PaperProps;

export function SomethingWentWrong({ onClickRefresh, ...rest }: Props) {
  const theme = useTheme();
  const globalTheme = useGlobalTheme();

  return (
    <PagePromptPaper {...rest}>
      <TwoToneCircleIcon color={"warning"} icon={<PriorityHighRoundedIcon />} />

      <Box m={theme.spacing(3, 0)} maxWidth={"400px"}>
        <Typography gutterBottom fontWeight={600} align={"center"}>
          Something went wrong
        </Typography>
        <Typography color={globalTheme.colors.grey[500]} align={"center"}>
          We had some trouble loading this page. Please refresh the page to try again or
          get in touch if the problem sticks around.
        </Typography>
      </Box>

      <Box display={"flex"}>
        <Button
          variant={"outlined"}
          color={"neutral"}
          size={"small"}
          href={VIZ_SUPPORT_LINK}
          target={"_blank"}
          rel={"noreferrer"}
          sx={{ mr: theme.spacing(3) }}
        >
          Contact support
        </Button>
        <Button variant={"contained"} size={"small"} onClick={onClickRefresh}>
          Refresh page
        </Button>
      </Box>
    </PagePromptPaper>
  );
}

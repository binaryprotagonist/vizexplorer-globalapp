import { Button, Typography, useGlobalTheme } from "@vizexplorer/global-ui-v2";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Box, useTheme } from "@mui/material";
import { TwoToneCircleIcon } from "view-v2/two-tone-circle-icon";
import { PagePromptPaper } from "view-v2/page";

type Props = {
  onClickAddNewRule: VoidFunction;
};

export function NoRules({ onClickAddNewRule }: Props) {
  const theme = useTheme();
  const globalTheme = useGlobalTheme();

  return (
    <PagePromptPaper data-testid={"no-rules"}>
      <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
        <TwoToneCircleIcon icon={<AddRoundedIcon />} color={"primary"} />

        <Box m={theme.spacing(3, 0)} maxWidth={"400px"}>
          <Typography gutterBottom fontWeight={600} align={"center"}>
            Start by adding your first rule
          </Typography>
          <Typography color={globalTheme.colors.grey[500]} align={"center"}>
            Your greet rules will live here.
            <br />
            Start by adding your first one.
          </Typography>
        </Box>

        <Button
          variant={"contained"}
          size={"small"}
          onClick={onClickAddNewRule}
          startIcon={<AddRoundedIcon sx={{ scale: "1.2" }} />}
        >
          Add rule
        </Button>
      </Box>
    </PagePromptPaper>
  );
}

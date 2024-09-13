import { Button, Typography, useGlobalTheme } from "@vizexplorer/global-ui-v2";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Box, useTheme } from "@mui/material";
import { TwoToneCircleIcon } from "view-v2/two-tone-circle-icon";
import { PagePromptPaper } from "view-v2/page";

type Props = {
  onClickAddNewProgram: VoidFunction;
};

export function NoPrograms({ onClickAddNewProgram }: Props) {
  const theme = useTheme();
  const globalTheme = useGlobalTheme();

  return (
    <PagePromptPaper data-testid={"no-programs"}>
      <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
        <TwoToneCircleIcon icon={<AddRoundedIcon />} color={"primary"} />

        <Box m={theme.spacing(3, 0)} maxWidth={"400px"}>
          <Typography gutterBottom fontWeight={600} align={"center"}>
            Start by adding your first goal program
          </Typography>
          <Typography color={globalTheme.colors.grey[500]} align={"center"}>
            Your active goal programs will live here. <br />
            Start by adding your first one.
          </Typography>
        </Box>

        <Button
          variant={"contained"}
          size={"small"}
          onClick={onClickAddNewProgram}
          startIcon={<AddRoundedIcon sx={{ scale: "1.2" }} />}
        >
          Add program
        </Button>
      </Box>
    </PagePromptPaper>
  );
}

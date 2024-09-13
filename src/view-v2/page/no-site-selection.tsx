import { Box, useTheme } from "@mui/material";
import { Typography, useGlobalTheme } from "@vizexplorer/global-ui-v2";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import { TwoToneCircleIcon } from "view-v2/two-tone-circle-icon";
import { PagePromptPaper } from "./page-prompt-paper";

type Props = {
  requiredFor: string;
};

export function NoSiteSelection({ requiredFor }: Props) {
  const theme = useTheme();
  const globalTheme = useGlobalTheme();

  return (
    <PagePromptPaper data-testid={"no-site-selection"}>
      <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
        <TwoToneCircleIcon icon={<ApartmentRoundedIcon />} color={"primary"} />

        <Box m={theme.spacing(3, 0)} maxWidth={"332px"}>
          <Typography gutterBottom fontWeight={600} align={"center"}>
            Start by selecting a property
          </Typography>
          <Typography color={globalTheme.colors.grey[500]} align={"center"}>
            Select a property in the dropdown above to manage its {requiredFor}.
          </Typography>
        </Box>
      </Box>
    </PagePromptPaper>
  );
}

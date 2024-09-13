import { Box, useTheme } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { Button, Typography, useGlobalTheme } from "@vizexplorer/global-ui-v2";
import { TwoToneCircleIcon } from "view-v2/two-tone-circle-icon";

type Props = {
  search: string;
  onClickClearSearch: VoidFunction;
};

export function NoSearchResult({ search, onClickClearSearch }: Props) {
  const theme = useTheme();
  const globalTheme = useGlobalTheme();

  return (
    <Box
      data-testid={"no-search-results"}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
    >
      <TwoToneCircleIcon icon={<SearchRoundedIcon />} color={"primary"} />

      <Box m={theme.spacing(3, 0)} maxWidth={"400px"}>
        <Typography gutterBottom fontWeight={600} align={"center"}>
          No rule found
        </Typography>
        <Typography color={globalTheme.colors.grey[500]} align={"center"}>
          Your search {`"${search}"`} did not match any rule. Please try again or add a
          new one.
        </Typography>
      </Box>

      <Button
        variant={"outlined"}
        color={"neutral"}
        size={"small"}
        onClick={onClickClearSearch}
      >
        Clear search
      </Button>
    </Box>
  );
}

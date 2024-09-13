import {
  TextField,
  Typography,
  PopoverPaper,
  useGlobalTheme
} from "@vizexplorer/global-ui-v2";
import { Box, MenuItem, Radio, SxProps } from "@mui/material";
import { gql } from "@apollo/client";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import { SiteSelectSiteFragment } from "./__generated__/site-select";

type Props = {
  selected: SiteSelectSiteFragment | null;
  sites: SiteSelectSiteFragment[];
  onChange: (value: SiteSelectSiteFragment) => void;
  disabled?: boolean;
  sx?: SxProps;
};

// TODO Solve the issue where input is covered by the menu when it reaches the end of the screen https://github.com/mui/material-ui/issues/36776

export function SiteSelect({ selected, sites, onChange, ...rest }: Props) {
  const theme = useGlobalTheme();

  return (
    <TextField
      select
      data-testid={"site-select"}
      value={selected?.id ?? ""}
      onChange={(e) => {
        const option = sites.find((option) => option.id === e.target.value);
        if (!option) return;
        onChange(option);
      }}
      SelectProps={{
        displayEmpty: true,
        renderValue: (selected) => {
          const option = sites.find((option) => option.id === selected);
          return option ? (
            option.name
          ) : (
            <Typography variant={"placeholder"}>Search Property</Typography>
          );
        },
        MenuProps: {
          sx: {
            maxHeight: "40vh"
          },
          slots: { paper: PopoverPaper },
          slotProps: {
            paper: {
              elevation: 3,
              sx: {
                mt: 1
              }
            }
          }
        }
      }}
      InputProps={{
        startAdornment: <ApartmentRoundedIcon sx={{ fill: theme.colors.grey[500] }} />
      }}
      sx={{ width: "250px", mb: 2.5 }}
      {...rest}
    >
      {sites.map((option) => (
        <MenuItem key={option.id} value={option.id}>
          <Radio size={"small"} checked={selected?.id === option.id} />
          <Typography variant="bodySmall" sx={{ lineHeight: "110%" }}>
            {option.name}
          </Typography>
        </MenuItem>
      ))}
      {!sites.length && (
        <Box m={"6px 16px"}>
          <Typography variant={"bodySmall"} sx={{ color: theme.colors.grey[500] }}>
            No options
          </Typography>
        </Box>
      )}
    </TextField>
  );
}

SiteSelect.fragments = {
  siteSelectSite: gql`
    fragment SiteSelectSite on Site {
      id: idV2
      name
    }
  `
};

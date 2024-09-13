import {
  Autocomplete,
  AutocompleteProps,
  Skeleton,
  TextField,
  useTheme
} from "@mui/material";
import styled from "@emotion/styled";

const LoadingSiteDropdown = styled(Skeleton)(({ theme }) => ({
  width: 300,
  height: 53,
  transform: "scale(1)",
  transformOrigin: "0 0",
  marginLeft: theme.spacing(3)
}));

type GenericSite = {
  id: number | string;
  name: string;
};

type Props<T extends GenericSite> = {
  value: T | null;
  options: T[];
  onChange: (site: T) => void;
  loading?: boolean;
} & Pick<AutocompleteProps<T, false, true, false>, "getOptionDisabled" | "renderOption">;

export function SiteDropdown<T extends GenericSite>({
  value,
  options,
  onChange,
  getOptionDisabled,
  renderOption,
  loading = false
}: Props<T>) {
  const theme = useTheme();

  if (loading) {
    return <LoadingSiteDropdown data-testid={"site-dropdown-loading"} />;
  }

  return (
    <Autocomplete<T, false, true>
      data-testid={"site-dropdown"}
      disableClearable
      multiple={false}
      // @ts-ignore allow null value
      value={value}
      options={options}
      onChange={(_e, site) => onChange(site!)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={"Property"}
          placeholder={"Select Property"}
          InputLabelProps={{ shrink: true }}
        />
      )}
      getOptionLabel={(site) => site?.name || ""}
      isOptionEqualToValue={(option, site) => option.id === site.id}
      getOptionDisabled={getOptionDisabled}
      renderOption={renderOption}
      sx={{
        width: 300,
        transform: "scale(1)",
        transformOrigin: "0 0",
        marginLeft: theme.spacing(3)
      }}
    />
  );
}

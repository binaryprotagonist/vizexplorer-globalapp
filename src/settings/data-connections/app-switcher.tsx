import { Autocomplete, Skeleton, styled, TextField } from "@mui/material";
import { AppOption } from "./types";

const StyledSkeleton = styled(Skeleton)({
  width: 300,
  height: 40,
  transform: "scale(1)",
  transformOrigin: "0 0"
});

type Props = {
  selected: AppOption | null;
  options: AppOption[];
  onChange: (app: AppOption) => void;
  loading: boolean;
};

export function AppSwitcher({ selected, options, loading, onChange }: Props) {
  if (loading) {
    return <StyledSkeleton />;
  }

  return (
    <Autocomplete
      disableClearable
      // @ts-ignore allow null
      value={selected}
      options={options}
      onChange={(_, value) => onChange(value)}
      renderInput={(props) => <TextField {...props} />}
      size={"small"}
      style={{ maxWidth: 300 }}
    />
  );
}

import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { AssociationType } from "./types";

type Props = {
  value: AssociationType;
  onChange: (type: AssociationType) => void;
};

export function AssociationToggle({ value, onChange }: Props) {
  return (
    <ToggleButtonGroup
      data-testid={"association-toggle"}
      exclusive
      fullWidth
      value={value}
      sx={{ width: "342px" }}
      onChange={(_, value) => {
        if (!value) return;
        onChange(value);
      }}
    >
      <ToggleButton value={"all"} sx={{ textTransform: "none", fontWeight: 500 }}>
        All files
      </ToggleButton>
      <ToggleButton value={"associated"} sx={{ textTransform: "none", fontWeight: 500 }}>
        Associated
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

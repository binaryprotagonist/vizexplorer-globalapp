import { ReactNode } from "react";
import { Radio } from "@mui/material";
import { FormControlLabel } from "@vizexplorer/global-ui-v2";

type Props = React.HTMLAttributes<HTMLLIElement> & {
  option: ReactNode;
  selected?: boolean;
};

export function RadioOption({ option, selected, ...rest }: Props) {
  return (
    <li {...rest}>
      <FormControlLabel
        control={<Radio checked={selected} size={"small"} />}
        label={option}
      />
    </li>
  );
}

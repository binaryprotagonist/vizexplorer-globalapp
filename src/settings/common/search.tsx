import { CloseRounded, SearchRounded } from "@mui/icons-material";
import { TextFieldProps } from "@mui/material";
import { TextField, useGlobalTheme } from "@vizexplorer/global-ui-v2";

type Props = TextFieldProps & {
  onClickClose?: () => void;
};

export function Search({ onClickClose, value, InputProps, ...rest }: Props) {
  const theme = useGlobalTheme();

  return (
    <TextField
      data-testid={"search"}
      value={value}
      autoComplete={"off"}
      InputProps={{
        startAdornment: <SearchRounded sx={{ color: theme.colors.grey[500] }} />,
        endAdornment: (
          <CloseRounded
            fontSize={"small"}
            sx={{
              color: theme.colors.grey[500],
              cursor: "pointer",
              visibility: value ? "visible" : "hidden"
            }}
            onClick={onClickClose}
          />
        ),
        ...InputProps
      }}
      {...rest}
    />
  );
}

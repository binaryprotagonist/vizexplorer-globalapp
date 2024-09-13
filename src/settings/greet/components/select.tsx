import React from "react";
import {
  TextField,
  Typography,
  PopoverPaper,
  useGlobalTheme
} from "@vizexplorer/global-ui-v2";
import { Box, MenuItem, Radio, SxProps } from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";

// eslint-disable-next-line @typescript-eslint/ban-types
export type SelectOption<Value extends string, Ext extends Record<string, any> = {}> = {
  label: string;
  value: Value;
} & Ext;

type Props<Value extends string, Ext extends Record<string, any>> = {
  selected: Value | null;
  options: SelectOption<Value, Ext>[];
  onChange: (value: SelectOption<Value, Ext>) => void;
  placeholder?: string;
  startAdornment?: React.ReactNode;
  disabled?: boolean;
  sx?: SxProps;
};

// TODO Solve the issue where input is covered by the menu when it reaches the end of the screen https://github.com/mui/material-ui/issues/36776

// eslint-disable-next-line @typescript-eslint/ban-types
export function Select<Value extends string, Ext extends Record<string, any> = {}>({
  selected,
  options,
  onChange,
  placeholder,
  startAdornment,
  ...rest
}: Props<Value, Ext>) {
  const theme = useGlobalTheme();

  return (
    <TextField
      select
      value={selected ?? ""}
      onChange={(e) => {
        const option = options.find((option) => option.value === e.target.value);
        if (!option) return;
        onChange(option);
      }}
      SelectProps={{
        displayEmpty: true,
        IconComponent: (props) => (
          <ExpandMoreRoundedIcon
            {...props}
            style={{
              // match autocomplete positioning
              right: "9px"
            }}
          />
        ),
        renderValue: (selected) => {
          const option = options.find((option) => option.value === selected);
          return option ? (
            option.label
          ) : (
            <Typography variant={"placeholder"}>{placeholder}</Typography>
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
        startAdornment
      }}
      {...rest}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          <Radio size={"small"} checked={selected === option.value} />
          <Typography variant="bodySmall" sx={{ lineHeight: "110%" }}>
            {option.label}
          </Typography>
        </MenuItem>
      ))}
      {!options.length && (
        <Box m={"6px 16px"}>
          <Typography variant={"bodySmall"} sx={{ color: theme.colors.grey[500] }}>
            No options
          </Typography>
        </Box>
      )}
    </TextField>
  );
}

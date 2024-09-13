import { ReactNode } from "react";
import { Button, FormControlLabel, Typography } from "@vizexplorer/global-ui-v2";
import { Box, PopperProps, Radio, RadioGroup, menuClasses, styled } from "@mui/material";
import AddRounded from "@mui/icons-material/AddRounded";
import { Menu } from "view-v2/menu";

const StyledMenu = styled(Menu)({
  [`& .${menuClasses.paper}`]: {
    maxWidth: "340px",
    maxHeight: "356px",
    margin: "8px 0"
  },
  [`& .${menuClasses.list}`]: {
    padding: "16px"
  }
});

export type MenuOption<T extends string | number | boolean> = {
  label: string;
  value: T;
};

type Props<T extends string | number | boolean> = {
  anchorEl: PopperProps["anchorEl"];
  titleIcon?: ReactNode;
  title: string;
  selectedValue: T;
  options: MenuOption<T>[];
  onChange: (value: T) => void;
  onClickAddCustomItem?: () => void;
  onClose: VoidFunction;
};

export function SettingActionMenu<T extends string | number | boolean>({
  anchorEl,
  titleIcon,
  title,
  selectedValue,
  options,
  onChange,
  onClickAddCustomItem,
  ...rest
}: Props<T>) {
  return (
    <StyledMenu open={!!anchorEl} anchorEl={anchorEl} placement="bottom-end" {...rest}>
      <Box display={"flex"} flexDirection={"column"} rowGap={1}>
        <Box display={"flex"} gap={"8px"}>
          {titleIcon}
          <Typography fontWeight={600}>{title}</Typography>
        </Box>

        <RadioGroup
          value={selectedValue}
          onChange={(_, value) => {
            if (typeof selectedValue === "number") {
              onChange(Number(value) as T);
            } else if (typeof selectedValue === "boolean") {
              onChange((value === "true" ? true : false) as T);
            } else {
              onChange(value as T);
            }
          }}
          sx={{ ml: "8px", rowGap: "8px" }}
        >
          {options.map((option) => (
            <FormControlLabel
              key={`action-menu-option-${option.value}`}
              role={"option"}
              value={option.value}
              label={
                <Typography variant={"bodySmall"} sx={{ lineHeight: "110%" }}>
                  {option.label}
                </Typography>
              }
              control={<Radio size={"small"} />}
            />
          ))}
        </RadioGroup>

        {onClickAddCustomItem && (
          <Box ml={"4px"}>
            <Button
              size={"small"}
              variant={"text"}
              startIcon={<AddRounded />}
              onClick={onClickAddCustomItem}
            >
              Add custom item
            </Button>
          </Box>
        )}
      </Box>
    </StyledMenu>
  );
}

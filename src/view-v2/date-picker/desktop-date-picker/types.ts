import {
  DesktopDatePickerProps as MuiDesktopDatePickerProps,
  PickerValidDate
} from "@mui/x-date-pickers";

export type DesktopDatePickerProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false
> = MuiDesktopDatePickerProps<TDate, TEnableAccessibleFieldDOMStructure>;

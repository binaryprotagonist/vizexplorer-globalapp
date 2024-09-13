import { Ref, forwardRef } from "react";
import {
  DesktopDatePicker as MuiDesktopDatePicker,
  pickersDayClasses,
  pickersCalendarHeaderClasses,
  PickerValidDate,
  dayCalendarClasses,
  pickersYearClasses,
  DesktopDatePickerSlotProps
} from "@mui/x-date-pickers";
import { Paper, PaperProps, TextField, useGlobalTheme } from "@vizexplorer/global-ui-v2";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import { DesktopDatePickerProps } from "./types";
import { mergeSx } from "view-v2/styles";

export function DesktopDatePicker<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false
>({
  slots,
  slotProps: providedSlotProps,
  ...rest
}: DesktopDatePickerProps<TDate, TEnableAccessibleFieldDOMStructure>) {
  const slotProps = useSlotProps(providedSlotProps);

  return (
    <MuiDesktopDatePicker
      {...rest}
      slotProps={slotProps}
      slots={{
        leftArrowIcon: ArrowBackRoundedIcon,
        rightArrowIcon: ArrowForwardRoundedIcon,
        openPickerIcon: ExpandMoreRoundedIcon,
        switchViewIcon: ExpandMoreRoundedIcon,
        desktopPaper: DatePickerPaper,
        textField: TextField,
        ...slots
      }}
      {...rest}
    />
  );
}

const DatePickerPaper = forwardRef(
  ({ className: _className, sx, ...rest }: PaperProps, ref: Ref<HTMLDivElement>) => {
    return <Paper ref={ref} elevation={4} sx={{ my: "8px", ...sx }} {...rest} />;
  }
);

function useSlotProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false
>(
  provided?: DesktopDatePickerSlotProps<TDate, TEnableAccessibleFieldDOMStructure>
): DesktopDatePickerSlotProps<TDate, TEnableAccessibleFieldDOMStructure> {
  const globalTheme = useGlobalTheme();

  // for our use cases, function approach is currently not useful. If needed, we can add it later
  if (typeof provided?.day === "function") {
    throw Error("slotProps.day should be an object");
  }

  if (typeof provided?.calendarHeader === "function") {
    throw Error("slotProps.calendarHeader should be an object");
  }

  if (typeof provided?.textField === "function") {
    throw Error("slotProps.textField should be an object");
  }

  return {
    ...provided,
    layout: {
      ...provided?.layout,
      sx: mergeSx(
        {
          [`& .${dayCalendarClasses.weekDayLabel}`]: {
            fontFamily: globalTheme.fontFamily,
            fontSize: "14px",
            fontWeight: 600,
            color: "#000"
          },
          [`& .${pickersYearClasses.yearButton}`]: {
            fontFamily: globalTheme.fontFamily,
            color: "#000",
            [`&.Mui-selected`]: {
              ["&:focus"]: {
                backgroundColor: globalTheme.colors.primary[100]
              },
              backgroundColor: globalTheme.colors.primary[100],
              color: "#000",
              fontWeight: 600
            }
          }
        },
        provided?.layout?.sx
      )
    },
    calendarHeader: {
      ...provided?.calendarHeader,
      sx: mergeSx(
        {
          [`& .${pickersCalendarHeaderClasses.label}`]: {
            fontFamily: globalTheme.fontFamily,
            fontSize: "16px",
            fontWeight: 600,
            color: "#000"
          }
        },
        provided?.calendarHeader?.sx
      )
    },
    day: {
      ...provided?.day,
      sx: mergeSx(
        {
          fontFamily: globalTheme.fontFamily,
          color: "#000",
          fontSize: "14px",
          [`&.${pickersDayClasses.root}`]: {
            ["&:focus"]: {
              backgroundColor: "unset"
            },
            [`&.${pickersDayClasses.selected}`]: {
              ["&:focus"]: {
                backgroundColor: globalTheme.colors.primary[100]
              },
              "&:hover": {
                backgroundColor: globalTheme.colors.primary[100]
              },
              fontWeight: 600,
              backgroundColor: globalTheme.colors.primary[100],
              color: "#000"
            },
            [`&.${pickersDayClasses.today}`]: {
              border: "none"
            }
          }
        },
        provided?.day?.sx
      )
    },
    textField: {
      ...provided?.textField,
      InputProps: {
        startAdornment: (
          <CalendarMonthRoundedIcon sx={{ fill: globalTheme.colors.grey[500] }} />
        ),
        ...provided?.textField?.InputProps
      }
    },
    previousIconButton: { sx: { color: "#000" } },
    nextIconButton: { sx: { color: "#000" } },
    switchViewButton: { sx: { color: "#000" } }
  };
}

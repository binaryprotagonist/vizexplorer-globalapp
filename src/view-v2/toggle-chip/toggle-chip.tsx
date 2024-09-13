import {
  ToggleButton as MuiToggleButton,
  toggleButtonClasses,
  styled,
  ToggleButtonProps,
  buttonClasses
} from "@mui/material";
import { GlobalTheme, useGlobalTheme } from "@vizexplorer/global-ui-v2";

const StyledToggleChip = styled(MuiToggleButton, {
  shouldForwardProp: (prop) => prop !== "globalTheme"
})<{ globalTheme: GlobalTheme }>(({ globalTheme }) => ({
  fontFamily: globalTheme.fontFamily,
  textTransform: "none",
  borderRadius: "20px",
  color: "#000",
  fontSize: "14px",
  fontWeight: 400,
  lineHeight: "14px",
  [`&.${toggleButtonClasses.selected}`]: {
    borderColor: globalTheme.colors.grey[700],
    color: "initial"
  },
  [`&.${toggleButtonClasses.sizeSmall}`]: {
    padding: "4px 8px",
    height: "32px"
  }
}));

function commonIconStyles(ownerState: ToggleChipProps) {
  return {
    ...(ownerState.size === "small" && {
      "& > *:nth-of-type(1)": {
        fontSize: 18
      }
    })
  };
}

const ButtonStartIcon = styled("span")<{ ownerState: ToggleChipProps }>(
  ({ ownerState }) => ({
    display: "inherit",
    marginRight: 4,
    marginLeft: -4,
    ...(ownerState.size === "small" && {
      marginLeft: -2
    }),
    ...commonIconStyles(ownerState)
  })
);

const ButtonEndIcon = styled("span")<{ ownerState: ToggleChipProps }>(
  ({ ownerState }) => ({
    display: "inherit",
    marginRight: -4,
    marginLeft: 4,
    ...(ownerState.size === "small" && {
      marginRight: -2
    }),
    ...commonIconStyles(ownerState)
  })
);

export type ToggleChipProps = Omit<ToggleButtonProps, "value"> & {
  value?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
};

export function ToggleChip({
  startIcon: startIconProp,
  endIcon: endIconProp,
  size = "small",
  children,
  ...rest
}: ToggleChipProps) {
  const globalTheme = useGlobalTheme();
  const ownerState = { size, children, ...rest };

  const startIcon = startIconProp && (
    <ButtonStartIcon className={buttonClasses.startIcon} ownerState={ownerState}>
      {startIconProp}
    </ButtonStartIcon>
  );
  const endIcon = endIconProp && (
    <ButtonEndIcon className={buttonClasses.endIcon} ownerState={ownerState}>
      {endIconProp}
    </ButtonEndIcon>
  );

  return (
    <StyledToggleChip value={""} size={size} globalTheme={globalTheme} {...rest}>
      {startIcon}
      {children}
      {endIcon}
    </StyledToggleChip>
  );
}

import {
  AlertProps as GlobalAlertProps,
  ButtonProps,
  SnackbarProps
} from "@vizexplorer/global-ui-v2";

export type AlertProps = {
  open: boolean;
} & NewAlert;

export type NewAlert = {
  id?: string;
  message?: string;
  severity?: GlobalAlertProps["severity"];
  actionProps?: ButtonProps;
  icon?: GlobalAlertProps["icon"];
  autoHideDuration?: SnackbarProps["autoHideDuration"];
  noWrap?: boolean;
  onClose?: (reason: "timeout" | "unmount") => void;
};

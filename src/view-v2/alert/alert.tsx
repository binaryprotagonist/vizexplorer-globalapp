import {
  AlertProps,
  Button,
  ButtonProps,
  Alert as LibAlert,
  Snackbar,
  SnackbarProps
} from "@vizexplorer/global-ui-v2";

type Props = {
  open: boolean;
  isMobile?: boolean;
  onClose: SnackbarProps["onClose"];
  onActionClick: VoidFunction;
  message?: string;
  severity?: AlertProps["severity"];
  actionProps?: ButtonProps;
  icon?: AlertProps["icon"];
  autoHideDuration?: SnackbarProps["autoHideDuration"];
  noWrap?: boolean;
};

export function Alert({
  open,
  isMobile = false,
  message,
  severity,
  actionProps = {},
  icon,
  autoHideDuration = 5000,
  noWrap = false,
  onClose,
  onActionClick,
  ...rest
}: Props) {
  const { children: actionChildren, onClick, ...restActionProps } = actionProps;

  return (
    <Snackbar
      disableWindowBlurListener
      open={open}
      isMobile={isMobile}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      {...rest}
    >
      <LibAlert
        noWrap={noWrap}
        variant={"filled"}
        severity={severity}
        icon={icon}
        action={
          !!Object.keys(actionProps).length && (
            <Button
              onClick={(e) => {
                onActionClick();
                onClick?.(e);
              }}
              {...restActionProps}
            >
              {actionChildren}
            </Button>
          )
        }
        sx={{
          maxWidth: "40vw"
        }}
      >
        {message}
      </LibAlert>
    </Snackbar>
  );
}

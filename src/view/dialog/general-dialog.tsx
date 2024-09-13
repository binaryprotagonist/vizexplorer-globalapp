import { css, Theme } from "@emotion/react";
import { ReactNode } from "react";
import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  dialogClasses,
  dialogContentClasses,
  dialogTitleClasses,
  DialogTitleProps,
  DialogActionsProps
} from "@mui/material";

const dialogStyle = (theme: Theme) =>
  css({
    [`& .${dialogClasses.paper}`]: {
      minWidth: "340px"
    },
    [`& .${dialogTitleClasses.root}+.${dialogContentClasses.root}`]: {
      padding: theme.spacing(2)
    }
  });

const headerStyle = (theme: Theme) =>
  css({
    padding: theme.spacing(2),
    background: "rgba(0, 138, 237, 0.08)"
  });

const actionStyle = (theme: Theme) =>
  css({
    padding: theme.spacing(2)
  });

export type Action = {
  content: ReactNode;
} & ButtonProps;

type Props = {
  title: string;
  actions?: Action[];
  children: ReactNode;
  titleProps?: DialogTitleProps;
  actionProps?: DialogActionsProps;
} & DialogProps;

export function GeneralDialog({
  title,
  actions,
  children,
  titleProps,
  actionProps,
  ...dialogProps
}: Props) {
  return (
    <Dialog data-testid={"general-dialog"} css={dialogStyle} {...dialogProps}>
      <DialogTitle css={headerStyle} {...titleProps}>
        {title}
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      {actions && (
        <DialogActions css={actionStyle} {...actionProps}>
          {actions.map(({ content, ...buttonProps }, idx) => (
            <Button key={`general-action-${idx}`} {...buttonProps}>
              {content}
            </Button>
          ))}
        </DialogActions>
      )}
    </Dialog>
  );
}

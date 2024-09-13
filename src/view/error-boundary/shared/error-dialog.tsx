import { css } from "@emotion/react";
import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  paperClasses
} from "@mui/material";

const paperStyle = css({
  [`& .${paperClasses.root}`]: {
    borderTop: "8px solid #FF0000",
    width: "min(600px, 80vw)"
  }
});

export type Action = {
  name: string;
  onClick: VoidFunction;
} & Pick<ButtonProps, "color">;

type Props = {
  title: string;
  actions: Action[];
  children: React.ReactNode;
};

export function ErrorDialog({ title, actions, children }: Props) {
  return (
    <Dialog data-testid={"error-dialog"} css={paperStyle} open={true}>
      <DialogTitle data-testid={"error-title"}>{title}</DialogTitle>
      <DialogContent data-testid={"error-content"}>{children}</DialogContent>
      <DialogActions data-testid={"error-actions"}>
        {actions.map((action) => (
          <Button key={action.name} {...action}>
            {action.name}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
}

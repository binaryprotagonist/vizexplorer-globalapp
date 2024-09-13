import React, { ReactNode } from "react";
import { DialogContentText } from "@mui/material";
import { Action, ErrorDialog } from "./error-dialog";
import { SessionExpiredError } from "@vizexplorer/global-ui-core";
import { baseUrl } from "../../../utils";
import { ContactUsLink } from "../../support";

type Props = {
  children: ReactNode;
};

export class ErrorBoundary extends React.Component<Props> {
  state: { error: any } = {
    error: null
  };

  static getDerivedStateFromError(error: any) {
    return { error };
  }

  componentDidCatch(error: any) {
    this.setState({ error });
  }

  render() {
    const { error } = this.state;

    if (!error) {
      return this.props.children;
    }

    return (
      <ErrorDialog title={error.displayName || error.name} actions={actions(error)}>
        <Message error={error} />
      </ErrorDialog>
    );
  }
}

function actions(error: Error): Action[] {
  if (error instanceof SessionExpiredError) {
    return [
      {
        name: "Login",
        onClick: () => {
          window.location.href = `${baseUrl()}login`;
        }
      }
    ];
  }

  return [
    {
      name: "OK",
      onClick: () => {
        window.location.reload();
      }
    }
  ];
}

function Message({ error }: { error: Error }) {
  if (error instanceof SessionExpiredError) {
    return <DialogContentText>{error.message}</DialogContentText>;
  }

  return (
    <>
      <DialogContentText sx={{ marginBottom: "16px" }}>
        {error.message || "An unexpected error occurred"}
      </DialogContentText>
      <DialogContentText>
        If you need any assistance, please <ContactUsLink />
      </DialogContentText>
    </>
  );
}

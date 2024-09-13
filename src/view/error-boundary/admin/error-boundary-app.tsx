import React from "react";
import { Button } from "@mui/material";
import { forbiddenMessage, forbiddenTitle, isForbiddenError } from "./utils";
import { BoundaryError } from "./types";
import { BoundaryErrorMessage, ErrorContainer } from "./error";
import { AdminContainerWithoutOrgCtx } from "../../container/admin/admin-container";
import { baseUrl } from "../../../utils";

function Container({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <AdminContainerWithoutOrgCtx>
      <ErrorContainer {...rest}>{children}</ErrorContainer>
    </AdminContainerWithoutOrgCtx>
  );
}

type Props = {
  children: React.ReactNode;
};

export class AdminAppErrorBoundary extends React.Component<Props> {
  state: { error: BoundaryError | null } = {
    error: null
  };

  static getDerivedStateFromError(error: any) {
    return { error };
  }

  componentDidCatch(error: BoundaryError) {
    this.setState({ error });
  }

  render() {
    const { error } = this.state;

    if (error) {
      if (isForbiddenError(error)) {
        return (
          <Container data-testid={"forbidden"}>
            <BoundaryErrorMessage title={forbiddenTitle()} message={forbiddenMessage()} />
            <Button variant={"contained"} onClick={() => (window.location.href = "/")}>
              Home
            </Button>
          </Container>
        );
      }

      return (
        <Container data-testid={"boundary-error"}>
          <BoundaryErrorMessage
            title={"Error"}
            message={error.message || "An unexpected error occurred"}
          />
          <Button
            variant={"contained"}
            onClick={() => (window.location.href = baseUrl())}
          >
            Home
          </Button>
        </Container>
      );
    }

    return this.props.children;
  }
}

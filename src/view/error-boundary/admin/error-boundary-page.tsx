import React from "react";
import { useLocation } from "react-router-dom";
import { forbiddenMessage, forbiddenTitle, isForbiddenError } from "./utils";
import { BoundaryError } from "./types";
import { BoundaryErrorMessage, ErrorContainer } from "./error";

type Props = {
  children: React.ReactNode;
  location: Location;
};

class AdminPageErrorBoundaryClass extends React.Component<Props> {
  state: { error: BoundaryError | null } = {
    error: null
  };

  static getDerivedStateFromError(error: any) {
    return { error };
  }

  componentDidCatch(error: BoundaryError) {
    this.setState({ error });
  }

  componentDidUpdate(prevProps: Props) {
    // reset error state on location change if there is an error set
    if (!this.state.error) return;

    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.setState({ error: null });
    }
  }

  render() {
    const { error } = this.state;

    if (error) {
      if (isForbiddenError(error)) {
        return (
          <ErrorContainer data-testid={"forbidden"}>
            <BoundaryErrorMessage title={forbiddenTitle()} message={forbiddenMessage()} />
          </ErrorContainer>
        );
      }

      return (
        <ErrorContainer data-testid={"boundary-error"}>
          <BoundaryErrorMessage
            title={"Error"}
            message={error.message || "An unexpected error occurred"}
          />
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

function withLocation(Component: any) {
  function ComponentWithLocation(props: Omit<Props, "location">) {
    const location = useLocation();

    return <Component {...props} location={location} />;
  }

  return ComponentWithLocation;
}

export const AdminPageErrorBoundary = withLocation(AdminPageErrorBoundaryClass);

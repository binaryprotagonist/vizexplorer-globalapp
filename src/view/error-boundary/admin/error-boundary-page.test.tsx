import { render } from "@testing-library/react";
import { AdminPageErrorBoundary } from "./error-boundary-page";
import { ThemeProvider } from "../../../theme";
import { Router } from "react-router-dom";
import { History, createMemoryHistory } from "history";
import { ApolloError } from "@apollo/client";

function BoundaryChild({ error }: { error?: any }) {
  if (error) throw error;
  return <div data-testid={"child"} />;
}

describe("<AdminPageErrorBoundary />", () => {
  let history: History;

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    history = createMemoryHistory();
  });

  function wrapper({ children }: any) {
    return (
      <ThemeProvider>
        <Router navigator={history} location={history.location}>
          {children}
        </Router>
      </ThemeProvider>
    );
  }

  it("renders children if there are no errors", () => {
    const { getByTestId } = render(
      <AdminPageErrorBoundary>
        <BoundaryChild />
      </AdminPageErrorBoundary>,
      { wrapper }
    );

    expect(getByTestId("child")).toBeInTheDocument();
  });

  it("doesn't render children if an error is thrown", () => {
    const { queryByTestId, getByTestId } = render(
      <AdminPageErrorBoundary>
        <BoundaryChild error={new Error()} />
      </AdminPageErrorBoundary>,
      { wrapper }
    );

    expect(queryByTestId("child")).not.toBeInTheDocument();
    expect(getByTestId("boundary-error")).toBeInTheDocument();
  });

  it("resets Error state if router location changes", () => {
    const { queryByTestId, getByTestId, rerender } = render(
      <AdminPageErrorBoundary>
        <BoundaryChild error={new Error()} />
      </AdminPageErrorBoundary>,
      { wrapper }
    );

    expect(getByTestId("boundary-error")).toBeInTheDocument();
    expect(queryByTestId("child")).not.toBeInTheDocument();

    history.push("/another/route");
    rerender(
      <AdminPageErrorBoundary>
        <BoundaryChild />
      </AdminPageErrorBoundary>
    );

    expect(queryByTestId("boundary-error")).not.toBeInTheDocument();
    expect(getByTestId("child")).toBeInTheDocument();
  });

  describe("General Error", () => {
    it("renders basic error information", () => {
      const { getByText } = render(
        <AdminPageErrorBoundary>
          <BoundaryChild error={new Error("Some Error Message")} />
        </AdminPageErrorBoundary>,
        { wrapper }
      );

      expect(getByText("Error")).toBeInTheDocument();
      expect(getByText("Some Error Message"));
    });

    it("renders alternate message if thrown error doesn't provide one", () => {
      const { getByText } = render(
        <AdminPageErrorBoundary>
          <BoundaryChild error={new Error()} />
        </AdminPageErrorBoundary>,
        { wrapper }
      );

      expect(getByText("Error")).toBeInTheDocument();
      expect(getByText("An unexpected error occurred"));
    });
  });

  describe("Forbidden Error", () => {
    const forbiddenError = new ApolloError({
      graphQLErrors: [{ extensions: { code: "FORBIDDEN" } }]
    } as any);

    it("can handle Forbidden error", () => {
      const { getByTestId } = render(
        <AdminPageErrorBoundary>
          <BoundaryChild error={forbiddenError} />
        </AdminPageErrorBoundary>,
        { wrapper }
      );

      expect(getByTestId("forbidden")).toBeInTheDocument();
    });
  });
});

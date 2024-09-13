import { fireEvent, render } from "@testing-library/react";
import { AdminAppErrorBoundary } from "./error-boundary-app";
import { ThemeProvider } from "../../../theme";
import { Router } from "react-router-dom";
import { History, createMemoryHistory } from "history";
import { RecoilRoot } from "recoil";
import { MockAuthProvider } from "@vizexplorer/global-ui-core";
import { ApolloError } from "@apollo/client";

jest.mock("../../../utils", () => ({
  isAdminBuild: () => true,
  baseUrl: () => "/admin/"
}));

function BoundaryChild({ error }: { error?: any }) {
  if (error) throw error;
  return <div data-testid={"child"} />;
}

describe("<AdminAppErrorBoundary />", () => {
  let history: History;

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  beforeEach(() => {
    history = createMemoryHistory();
  });

  function wrapper({ children }: any) {
    return (
      <RecoilRoot>
        <MockAuthProvider>
          <ThemeProvider>
            <Router navigator={history} location={history.location}>
              {children}
            </Router>
          </ThemeProvider>
        </MockAuthProvider>
      </RecoilRoot>
    );
  }

  it("renders children if there are no errors", () => {
    const { getByTestId } = render(
      <AdminAppErrorBoundary>
        <BoundaryChild />
      </AdminAppErrorBoundary>,
      { wrapper }
    );

    expect(getByTestId("child")).toBeInTheDocument();
  });

  it("doesn't render children if an error is thrown", () => {
    const { queryByTestId, getByTestId } = render(
      <AdminAppErrorBoundary>
        <BoundaryChild error={new Error()} />
      </AdminAppErrorBoundary>,
      { wrapper }
    );

    expect(queryByTestId("child")).not.toBeInTheDocument();
    expect(getByTestId("boundary-error")).toBeInTheDocument();
  });

  describe("General Error", () => {
    it("renders error information", () => {
      const { getByText } = render(
        <AdminAppErrorBoundary>
          <BoundaryChild error={new Error("Some Error Message")} />
        </AdminAppErrorBoundary>,
        { wrapper }
      );

      expect(getByText("Error")).toBeInTheDocument();
      expect(getByText("Some Error Message"));
    });

    it("renders Home button", () => {
      delete (window as any).location;
      window.location = {
        href: "/something"
      } as any;
      const { getByText } = render(
        <AdminAppErrorBoundary>
          <BoundaryChild error={new Error("Some Error Message")} />
        </AdminAppErrorBoundary>,
        { wrapper }
      );

      expect(getByText("Home")).toBeInTheDocument();
      fireEvent.click(getByText("Home"));
      expect(window.location.href).toEqual("/admin/");
    });

    it("renders alternate message if thrown error doesn't provide one", () => {
      const { getByText } = render(
        <AdminAppErrorBoundary>
          <BoundaryChild error={new Error()} />
        </AdminAppErrorBoundary>,
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

    it("renders Forbidden error", () => {
      const { getByTestId } = render(
        <AdminAppErrorBoundary>
          <BoundaryChild error={forbiddenError} />
        </AdminAppErrorBoundary>,
        { wrapper }
      );

      expect(getByTestId("forbidden")).toBeInTheDocument();
    });

    it("renders Home button", () => {
      delete (window as any).location;
      window.location = {
        href: ""
      } as any;
      const { getByText } = render(
        <AdminAppErrorBoundary>
          <BoundaryChild error={forbiddenError} />
        </AdminAppErrorBoundary>,
        { wrapper }
      );

      expect(getByText("Home")).toBeInTheDocument();
      fireEvent.click(getByText("Home"));
      expect(window.location.href).toEqual("/");
    });
  });
});

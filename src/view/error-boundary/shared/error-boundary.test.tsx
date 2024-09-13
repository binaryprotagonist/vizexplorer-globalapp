import { render } from "@testing-library/react";
import { ErrorBoundary } from "./error-boundary";
import { SessionExpiredError } from "@vizexplorer/global-ui-core";

describe("<ErrorBoundary />", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("renders children given no error thrown", () => {
    const { getByText } = render(
      <ErrorBoundary>
        <div>children</div>
      </ErrorBoundary>
    );

    expect(getByText("children")).toBeInTheDocument();
  });

  it("renders message of thrown generic error", () => {
    function GenericError() {
      throw new Error("some error");
    }
    const { getByText } = render(
      <ErrorBoundary>
        {/** @ts-ignore jsx warning - jsx not needed since we are just throwing an error */}
        <GenericError />
      </ErrorBoundary>
    );

    expect(getByText("Error")).toBeInTheDocument();
    expect(getByText("some error")).toBeInTheDocument();
    expect(getByText("Contact Us")).toBeInTheDocument();
  });

  it("renders a predetermined message of one isn't provided with the error", () => {
    function NoMessageError() {
      throw new Error();
    }
    const { getByText } = render(
      <ErrorBoundary>
        {/** @ts-ignore */}
        <NoMessageError />
      </ErrorBoundary>
    );

    expect(getByText("Error")).toBeInTheDocument();
    expect(getByText("An unexpected error occurred")).toBeInTheDocument();
    expect(getByText("Contact Us")).toBeInTheDocument();
  });

  it("can handle SessionExpiredError", () => {
    function SessionExpired() {
      throw new SessionExpiredError();
    }
    const { getByText, queryByText } = render(
      <ErrorBoundary>
        {/** @ts-ignore */}
        <SessionExpired />
      </ErrorBoundary>
    );
    expect(getByText("Session Expired")).toBeInTheDocument();
    expect(getByText("Your session expired")).toBeInTheDocument();
    expect(queryByText("Contact Us")).not.toBeInTheDocument();
  });
});

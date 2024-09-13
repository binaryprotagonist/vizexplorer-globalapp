import { fireEvent, render } from "@testing-library/react";
import { ManageLicenseButton } from "./manage-license-button";
import { Router } from "react-router-dom";
import { createMemoryHistory, History } from "history";

describe("<ManageLicenseButton />", () => {
  let history: History;

  beforeEach(() => {
    history = createMemoryHistory({ initialEntries: ["/subscription"] });
  });

  function wrapper({ children }: any) {
    return (
      <Router navigator={history} location={history.location}>
        {children}
      </Router>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(<ManageLicenseButton />, { wrapper });

    expect(getByTestId("manage-license-button")).toBeInTheDocument();
  });

  it("renders as enabled if disabled isn't provided", () => {
    const { getByTestId } = render(<ManageLicenseButton />, { wrapper });

    expect(getByTestId("manage-license-button")).toBeEnabled();
  });

  it("renders as disabled if disabled is true", () => {
    const { getByTestId } = render(<ManageLicenseButton disabled />, { wrapper });

    expect(getByTestId("manage-license-button")).toBeDisabled();
  });

  it("navigates on click", () => {
    const { getByTestId } = render(<ManageLicenseButton />, { wrapper });

    fireEvent.click(getByTestId("manage-license-button"));

    expect(history.location.pathname).toEqual("/license/manage");
    expect(history.location.state).toEqual({ prevPage: "/subscription" });
  });
});

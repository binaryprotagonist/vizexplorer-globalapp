import { fireEvent, render } from "@testing-library/react";
import { ThemeProvider } from "../../../theme";
import { Header } from "./header";
import {
  MockAuthProvider,
  MockGraphQLProvider,
  MockRecoilProvider
} from "@vizexplorer/global-ui-core";
import { createMemoryHistory, History } from "history";
import { Router } from "react-router-dom";

describe("<Header />", () => {
  let history: History = null as any;

  beforeEach(() => {
    history = createMemoryHistory();
  });

  function wrapper({ children }: any) {
    return (
      <MockRecoilProvider>
        <MockAuthProvider>
          <MockGraphQLProvider>
            <ThemeProvider>
              <Router navigator={history} location={history.location}>
                {children}
              </Router>
            </ThemeProvider>
          </MockGraphQLProvider>
        </MockAuthProvider>
      </MockRecoilProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(<Header logo={null} />, { wrapper });

    expect(getByTestId("header")).toBeInTheDocument();
  });

  it("navigates to `/settings` if the logo is clicked while on a settings page", () => {
    history.push("/settings/some/route");
    const { getByTestId } = render(<Header logo={<div data-testid={"mock-logo"} />} />, {
      wrapper
    });

    fireEvent.click(getByTestId("mock-logo"));
    expect(history.location.pathname).toEqual("/settings");
  });

  it("doesn't navigate on logo click if user is not on a settings page", () => {
    history.push("/some/route");
    const { getByTestId } = render(<Header logo={<div data-testid={"mock-logo"} />} />, {
      wrapper
    });

    fireEvent.click(getByTestId("mock-logo"));
    expect(history.location.pathname).toEqual("/some/route");
  });

  it("doesn't render burger icon if `showBurger` prop isn't provided", () => {
    const { queryByTestId } = render(<Header logo={null} />, { wrapper });

    expect(queryByTestId("global-header-hamburger")).not.toBeInTheDocument();
  });

  it("render burgers icon if `showBurger` is true", () => {
    const { getByTestId } = render(<Header showBurger logo={null} />, {
      wrapper
    });

    expect(getByTestId("global-header-hamburger")).toBeInTheDocument();
  });

  it("runs `onBurgerClick` if the burger icon is clicked", () => {
    const mockOnBurgerClick = jest.fn();
    const { getByTestId } = render(
      <Header showBurger logo={null} onBurgerClick={mockOnBurgerClick} />,
      { wrapper }
    );

    fireEvent.click(getByTestId("global-header-hamburger"));
    expect(mockOnBurgerClick).toHaveBeenCalled();
  });
});

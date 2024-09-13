import { fireEvent, render } from "@testing-library/react";
import { AdminHeader } from "./admin-header";
import { ThemeProvider } from "../../../theme";
import { Route, Router, Routes } from "react-router-dom";
import { createMemoryHistory, History } from "history";
import { RecoilRoot } from "recoil";

describe("<AdminHeader />", () => {
  let history: History = null as any;

  beforeEach(() => {
    history = createMemoryHistory();
  });

  function wrapper({ children }: any) {
    return (
      <RecoilRoot>
        <ThemeProvider>
          <Router navigator={history} location={history.location}>
            <Routes>
              <Route path={"*"} element={children} />
            </Routes>
          </Router>
        </ThemeProvider>
      </RecoilRoot>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(<AdminHeader />, { wrapper });

    expect(getByTestId("admin-header")).toBeInTheDocument();
  });

  it("navigates to /org if the logo is clicked", () => {
    history.push("/some/path");
    render(<AdminHeader />, { wrapper });

    expect(history.location.pathname).toEqual("/some/path");

    const logo = document.getElementsByTagName("svg")[0];
    fireEvent.click(logo);
    expect(history.location.pathname).toEqual("/org");
  });

  it("doesn't render burger icon if `showBurger` prop isn't provided", () => {
    const { queryByTestId } = render(<AdminHeader />, { wrapper });

    expect(queryByTestId("global-header-hamburger")).not.toBeInTheDocument();
  });

  it("render burgers icon if `showBurger` is true", () => {
    const { getByTestId } = render(<AdminHeader showBurger />, { wrapper });

    expect(getByTestId("global-header-hamburger")).toBeInTheDocument();
  });

  it("runs `onBurgerClick` if the burger icon is clicked", () => {
    const mockOnBurgerClick = jest.fn();
    const { getByTestId } = render(
      <AdminHeader showBurger onBurgerClick={mockOnBurgerClick} />,
      { wrapper }
    );

    fireEvent.click(getByTestId("global-header-hamburger"));
    expect(mockOnBurgerClick).toHaveBeenCalled();
  });
});

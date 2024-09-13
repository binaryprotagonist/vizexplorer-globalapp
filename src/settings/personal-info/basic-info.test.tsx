import { fireEvent, render } from "@testing-library/react";
import { mockAdmin } from "../../view/testing/mocks";
import { BasicInfo } from "./basic-info";
import { ThemeProvider } from "../../theme";
import { createMemoryHistory, History } from "history";
import { Router } from "react-router-dom";

const currentUser = { ...mockAdmin };

describe("<BasicInfo />", () => {
  let history: History = null as any;

  beforeEach(() => {
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

  it("renders", () => {
    const { getByTestId } = render(<BasicInfo currentUser={currentUser} />, {
      wrapper
    });

    expect(getByTestId("basic-info")).toBeInTheDocument();
  });

  it("renders fields and associated user information", () => {
    const { getByText } = render(<BasicInfo currentUser={currentUser} />, {
      wrapper
    });

    expect(getByText("Name")).toBeInTheDocument();
    expect(
      getByText(`${currentUser.firstName} ${currentUser.lastName}`)
    ).toBeInTheDocument();
    expect(getByText("Email")).toBeInTheDocument();
    expect(getByText(currentUser.email)).toBeInTheDocument();
    expect(getByText("Phone")).toBeInTheDocument();
    expect(getByText(currentUser.phone)).toBeInTheDocument();
  });

  it("renders Manage button", () => {
    const { getByText } = render(<BasicInfo currentUser={currentUser} />, {
      wrapper
    });

    expect(getByText("Manage Basic Info")).toBeInTheDocument();
  });

  it("directs to the correct page if Manage button is clicked", () => {
    const { getByText } = render(<BasicInfo currentUser={currentUser} />, {
      wrapper
    });

    fireEvent.click(getByText("Manage Basic Info"));
    expect(history.location.pathname).toEqual("/settings/personal-info/basic-info/edit");
  });
});

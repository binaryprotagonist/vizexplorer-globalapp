import { fireEvent, render } from "@testing-library/react";
import { ApplicationCard } from "./application-card";
import {
  generateDummyOrgApps,
  LAST_ACCESSED_APP,
  OrgAppFragment
} from "@vizexplorer/global-ui-core";
import { ThemeProvider } from "../theme";

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("ApplicationCard", () => {
  let mockApp: OrgAppFragment = null as any;

  beforeEach(() => {
    localStorage.clear();
    mockApp = generateDummyOrgApps(1)[0];
  });

  it("renders", () => {
    const { getByTestId } = render(<ApplicationCard application={mockApp} />, {
      wrapper
    });

    expect(getByTestId("app-card")).toBeInTheDocument();
  });

  it("renders the applications icon", () => {
    const { getByTestId } = render(<ApplicationCard application={mockApp} />, {
      wrapper
    });

    const appIcon = getByTestId("app-card-icon");
    expect(appIcon).toBeInTheDocument();
    expect(appIcon).toHaveAttribute("src", mockApp.icon);
  });

  it("renders the applications full name", () => {
    const { getByText } = render(<ApplicationCard application={mockApp} />, {
      wrapper
    });

    expect(getByText(mockApp.name)).toBeInTheDocument();
  });

  it("renders 'Expired' if the 'isValid' status is false", () => {
    mockApp.isValid = false;
    const { getByText } = render(<ApplicationCard application={mockApp} />, {
      wrapper
    });

    expect(getByText("Expired")).toBeInTheDocument();
  });

  it("doesn't render 'Expired' if that 'isValid' status is true", () => {
    const { queryByText } = render(<ApplicationCard application={mockApp} />, {
      wrapper
    });

    expect(queryByText("Expired")).not.toBeInTheDocument();
  });

  it("navigates to the app url when clicked", () => {
    delete (window as any).location;
    window.location = {
      href: "http://localhost/",
      pathname: "/"
    } as any;

    const { getByTestId } = render(<ApplicationCard application={mockApp} />, {
      wrapper
    });

    fireEvent.click(getByTestId("app-card"));

    expect(window.location.href).toEqual(mockApp.url);
  });

  it("opens mailto when clicked if 'isValid' status is false", () => {
    mockApp.isValid = false;
    delete (window as any).location;
    window.location = {
      href: "http://localhost/",
      pathname: "/"
    } as any;

    const { getByTestId } = render(<ApplicationCard application={mockApp} />, {
      wrapper
    });

    fireEvent.click(getByTestId("app-card"));

    const savedAppId = localStorage.getItem(LAST_ACCESSED_APP);
    expect(savedAppId).toEqual(null);
    expect(window.location.href).toContain("mailto:");
    expect(window.location.href).toContain(mockApp.name);
  });

  it("saves the app id to localstorage when clicked", () => {
    const { getByTestId } = render(<ApplicationCard application={mockApp} />, {
      wrapper
    });

    fireEvent.click(getByTestId("app-card"));

    const savedAppId = localStorage.getItem(LAST_ACCESSED_APP);
    expect(savedAppId).toEqual(mockApp.id);
  });
});

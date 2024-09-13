import { fireEvent, render } from "@testing-library/react";
import { generateDummySites } from "../../view/testing/mocks";
import { SiteDropdown } from "./site-dropdown";
import { ThemeProvider } from "../../theme";
import { getInput } from "../../view/testing";

const mockSites = generateDummySites(3);
const mouseDown = { keyCode: 40 };

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("Host Mapping <SiteDropdown />", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockReset();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <SiteDropdown value={mockSites[0]} options={mockSites} onChange={mockOnChange} />,
      { wrapper }
    );

    expect(getByTestId("site-dropdown")).toBeInTheDocument();
  });

  it("selects site based on provided `value`", () => {
    const { getByTestId } = render(
      <SiteDropdown value={mockSites[1]} options={mockSites} onChange={mockOnChange} />,
      { wrapper }
    );

    const siteDropdownInput = getInput(getByTestId("site-dropdown"));
    expect(siteDropdownInput).toHaveAttribute("value", mockSites[1].name);
  });

  it("renders site options by name", () => {
    const { getByTestId, getByText } = render(
      <SiteDropdown value={mockSites[0]} options={mockSites} onChange={mockOnChange} />,
      { wrapper }
    );

    fireEvent.keyDown(getByTestId("site-dropdown"), mouseDown);
    mockSites.forEach((site) => {
      expect(getByText(site.name)).toBeInTheDocument();
    });
  });

  it("renders loading skeleton if `loading` is true", () => {
    const { getByTestId, queryByTestId } = render(
      <SiteDropdown
        value={mockSites[0]}
        options={mockSites}
        onChange={mockOnChange}
        loading={true}
      />,
      { wrapper }
    );

    expect(getByTestId("site-dropdown-loading")).toBeInTheDocument();
    expect(queryByTestId("site-dropdown")).not.toBeInTheDocument();
  });
});

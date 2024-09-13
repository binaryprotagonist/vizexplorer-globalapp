import { fireEvent, render } from "@testing-library/react";
import { ManageTiersButton } from "./manage-tiers-button";
import {
  generateDummyLoyaltyTiers,
  mockAdmin,
  mockOrgAdmin,
  mockViewer
} from "../../../view/testing/mocks";
import { ThemeProvider } from "../../../theme";
import { act } from "react-dom/test-utils";

const mockOnClick = jest.fn();
const mockTiers = generateDummyLoyaltyTiers(3);

describe("<ManageTiersButton />", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    mockOnClick.mockReset();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  function wrapper({ children }: any) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  it("renders", () => {
    const { getByTestId } = render(
      <ManageTiersButton
        currentUser={mockOrgAdmin}
        tiers={mockTiers}
        onClick={mockOnClick}
        loading={false}
      />,
      { wrapper }
    );

    expect(getByTestId("manage-tiers-btn")).toBeInTheDocument();
  });

  it("enables for OrgAdmin", () => {
    const { getByTestId } = render(
      <ManageTiersButton
        currentUser={mockOrgAdmin}
        tiers={mockTiers}
        onClick={mockOnClick}
        loading={false}
      />,
      { wrapper }
    );

    expect(getByTestId("manage-tiers-btn")).toBeEnabled();
  });

  it("disables for Admin", () => {
    const { getByTestId } = render(
      <ManageTiersButton
        currentUser={mockAdmin}
        tiers={mockTiers}
        onClick={mockOnClick}
        loading={false}
      />,
      { wrapper }
    );

    expect(getByTestId("manage-tiers-btn")).toBeDisabled();
  });

  it("disables for Viewer", () => {
    const { getByTestId } = render(
      <ManageTiersButton
        currentUser={mockViewer}
        tiers={mockTiers}
        onClick={mockOnClick}
        loading={false}
      />,
      { wrapper }
    );

    expect(getByTestId("manage-tiers-btn")).toBeDisabled();
  });

  it("disables if `loading` is true", () => {
    const { getByTestId } = render(
      <ManageTiersButton
        currentUser={mockOrgAdmin}
        tiers={mockTiers}
        onClick={mockOnClick}
        loading={true}
      />,
      { wrapper }
    );

    expect(getByTestId("manage-tiers-btn")).toBeDisabled();
  });

  it("disables if `tiers` is empty", () => {
    const { getByTestId } = render(
      <ManageTiersButton
        currentUser={mockOrgAdmin}
        tiers={[]}
        onClick={mockOnClick}
        loading={false}
      />,
      { wrapper }
    );

    expect(getByTestId("manage-tiers-btn")).toBeDisabled();
  });

  it("displays expected tooltip if user lacks permission", () => {
    const { getByRole, getByTestId } = render(
      <ManageTiersButton
        currentUser={mockViewer}
        tiers={mockTiers}
        onClick={mockOnClick}
        loading={false}
      />,
      { wrapper }
    );

    act(() => {
      fireEvent.mouseOver(getByTestId("manage-tiers-btn"));
      jest.runAllTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent(
      "You don't have permission to add new tiers. Please contact an Admin"
    );
  });

  it("displays expected tooltip if loading is true", () => {
    const { getByRole, getByTestId } = render(
      <ManageTiersButton
        currentUser={mockOrgAdmin}
        tiers={mockTiers}
        onClick={mockOnClick}
        loading={true}
      />,
      { wrapper }
    );

    act(() => {
      fireEvent.mouseOver(getByTestId("manage-tiers-btn"));
      jest.runAllTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent("Loading...");
  });

  it("displays expected tooltip if `currentUser` is null", () => {
    const { getByRole, getByTestId } = render(
      <ManageTiersButton
        currentUser={null}
        tiers={mockTiers}
        onClick={mockOnClick}
        loading={false}
      />,
      { wrapper }
    );

    act(() => {
      fireEvent.mouseOver(getByTestId("manage-tiers-btn"));
      jest.runAllTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent("Loading...");
  });

  it("displays expected tooltip if no tiers are provided", () => {
    const { getByRole, getByTestId } = render(
      <ManageTiersButton
        currentUser={mockOrgAdmin}
        tiers={[]}
        onClick={mockOnClick}
        loading={false}
      />,
      { wrapper }
    );

    act(() => {
      fireEvent.mouseOver(getByTestId("manage-tiers-btn"));
      jest.runAllTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent("No Loyalty Tiers to manage");
  });

  it("runs `onClick` if clicked", () => {
    const { getByTestId } = render(
      <ManageTiersButton
        currentUser={mockOrgAdmin}
        tiers={mockTiers}
        onClick={mockOnClick}
        loading={false}
      />,
      { wrapper }
    );

    fireEvent.click(getByTestId("manage-tiers-btn"));
    expect(mockOnClick).toHaveBeenCalled();
  });
});

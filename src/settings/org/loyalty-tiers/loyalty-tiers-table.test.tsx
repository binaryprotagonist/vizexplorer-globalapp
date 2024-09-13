import { fireEvent, render } from "@testing-library/react";
import { LoyaltyTiersTable } from "./loyalty-tiers-table";
import { generateDummyLoyaltyTiers } from "../../../view/testing/mocks";
import { ThemeProvider } from "../../../theme";

describe("<LoyaltyTiersTable />", () => {
  const mockTiers = generateDummyLoyaltyTiers(3);

  function wrapper({ children }: any) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  it("renders", () => {
    const { getByTestId } = render(
      <LoyaltyTiersTable tiers={mockTiers} loading={false} />,
      { wrapper }
    );

    expect(getByTestId("loyalty-tiers-table")).toBeInTheDocument();
  });

  it("renders expected columns", () => {
    const { getByText } = render(
      <LoyaltyTiersTable tiers={mockTiers} loading={false} />,
      { wrapper }
    );

    expect(getByText("Rank Order")).toBeInTheDocument();
    expect(getByText("Tier Name")).toBeInTheDocument();
    expect(getByText("Color")).toBeInTheDocument();
  });

  it("renders expected row values", () => {
    const { getAllByTestId } = render(
      <LoyaltyTiersTable tiers={mockTiers} loading={false} />,
      { wrapper }
    );

    const rows = getAllByTestId("loyalty-tiers-row");
    rows.forEach((row, idx) => {
      expect(row).toHaveTextContent(`${mockTiers[idx].order}`);
      expect(row).toHaveTextContent(`${mockTiers[idx].name}`);
      const colorEle = row.querySelector("[data-testid='tier-table-color']");
      expect(colorEle).toHaveStyle(`background-color: ${mockTiers[idx].color}`);
    });
  });

  it("allows sorting by `Rank Order`", () => {
    const { getAllByTestId } = render(
      <LoyaltyTiersTable tiers={mockTiers} loading={false} />,
      { wrapper }
    );

    const sortableColumns = getAllByTestId("mtableheader-sortlabel");
    // rank order and name (color is not sortable)
    expect(sortableColumns).toHaveLength(1);
    expect(sortableColumns[0]).toHaveTextContent("Rank Order");
  });

  it("can sort by Rank Order", () => {
    const { getAllByTestId, getByText } = render(
      <LoyaltyTiersTable tiers={mockTiers} loading={false} />,
      { wrapper }
    );

    // validate ascending order (default)
    let rows = getAllByTestId("loyalty-tiers-row");
    expect(rows[0]).toHaveTextContent(mockTiers[0].name);
    expect(rows[1]).toHaveTextContent(mockTiers[1].name);
    expect(rows[2]).toHaveTextContent(mockTiers[2].name);

    // validate descending order
    fireEvent.click(getByText("Rank Order"));
    rows = getAllByTestId("loyalty-tiers-row");
    expect(rows[0]).toHaveTextContent(mockTiers[2].name);
    expect(rows[1]).toHaveTextContent(mockTiers[1].name);
    expect(rows[2]).toHaveTextContent(mockTiers[0].name);
  });

  it("renders `LoadingTable` if loading is true", () => {
    const { getByTestId, queryByTestId } = render(
      <LoyaltyTiersTable tiers={mockTiers} loading={true} />,
      { wrapper }
    );

    expect(getByTestId("loyalty-tiers-loading")).toBeInTheDocument();
    expect(queryByTestId("loyalty-tiers-table")).not.toBeInTheDocument();
  });

  it("doesn't render `LoadingTable` if loading is false", () => {
    const { getByTestId, queryByTestId } = render(
      <LoyaltyTiersTable tiers={mockTiers} loading={false} />,
      { wrapper }
    );

    expect(getByTestId("loyalty-tiers-table")).toBeInTheDocument();
    expect(queryByTestId("loyalty-tiers-loading")).not.toBeInTheDocument();
  });
});

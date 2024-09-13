import { fireEvent, render } from "@testing-library/react";
import { LoyaltyTiersDialog } from "./loyalty-tiers-dialog";
import { ThemeProvider } from "../../../../theme";
import { produce } from "immer";
import { LoyaltyTierFragment } from "generated-graphql";
import { generateDummyLoyaltyTiers } from "../../../../view/testing/mocks";
import { act } from "react-dom/test-utils";

describe("<LoyaltyTiersDialog />", () => {
  let tiers: LoyaltyTierFragment[] = [];
  const onClose = jest.fn();
  const onSave = jest.fn();

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    tiers = generateDummyLoyaltyTiers(4);
    onClose.mockClear();
    onSave.mockClear();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  function wrapper({ children }: any) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  it("renders", () => {
    const { getByTestId } = render(
      <LoyaltyTiersDialog
        tiers={tiers}
        loading={false}
        onClose={onClose}
        onSave={onSave}
      />,
      { wrapper }
    );

    expect(getByTestId("loyalty-tiers-dialog")).toBeInTheDocument();
  });

  it("renders expected headers", () => {
    const { getByText } = render(
      <LoyaltyTiersDialog
        tiers={tiers}
        loading={false}
        onClose={onClose}
        onSave={onSave}
      />,
      { wrapper }
    );

    expect(getByText("Rank Order")).toBeInTheDocument();
    expect(getByText("Tier Name")).toBeInTheDocument();
    expect(getByText("Color")).toBeInTheDocument();
    expect(getByText("Arrange")).toBeInTheDocument();
  });

  it("renders tier values and arrange actions", () => {
    const { getAllByTestId, getByText } = render(
      <LoyaltyTiersDialog
        tiers={tiers}
        loading={false}
        onClose={onClose}
        onSave={onSave}
      />,
      { wrapper }
    );

    const colorFields = getAllByTestId("tier-color-input");
    tiers.forEach((tier, idx) => {
      // Ranking Order
      expect(getByText(`${idx + 1}`)).toBeInTheDocument();
      expect(getByText(tier.name)).toBeInTheDocument();
      expect(colorFields[idx]).toHaveAttribute("value", `${tier.color}`);
    });
    const arrangeUps = getAllByTestId("tier-arrange-up");
    const arrangeDowns = getAllByTestId("tier-arrange-down");
    expect(arrangeUps).toHaveLength(tiers.length);
    expect(arrangeDowns).toHaveLength(tiers.length);
  });

  it("disables `Arrange Up` only for the first row", () => {
    const { getAllByTestId } = render(
      <LoyaltyTiersDialog
        tiers={tiers}
        loading={false}
        onClose={onClose}
        onSave={onSave}
      />,
      { wrapper }
    );

    const arrangeUps = getAllByTestId("tier-arrange-up");
    arrangeUps.forEach((up, idx) => {
      if (idx === 0) {
        expect(up).toBeDisabled();
      } else {
        expect(up).not.toBeDisabled();
      }
    });
  });

  it("disables `Arrange Down` only for the last row", () => {
    const { getAllByTestId } = render(
      <LoyaltyTiersDialog
        tiers={tiers}
        loading={false}
        onClose={onClose}
        onSave={onSave}
      />,
      { wrapper }
    );

    const arrangeDowns = getAllByTestId("tier-arrange-down");
    arrangeDowns.forEach((down, idx) => {
      if (idx === tiers.length - 1) {
        expect(down).toBeDisabled();
      } else {
        expect(down).not.toBeDisabled();
      }
    });
  });

  it("disables action buttons if `loading` is true", () => {
    const { getByText } = render(
      <LoyaltyTiersDialog
        tiers={tiers}
        loading={true}
        onClose={onClose}
        onSave={onSave}
      />,
      { wrapper }
    );

    expect(getByText("Save")).toBeDisabled();
    expect(getByText("Cancel")).toBeDisabled();
  });

  it("disables `color` fields if `loading` is true", () => {
    const { getAllByTestId } = render(
      <LoyaltyTiersDialog
        tiers={tiers}
        loading={true}
        onClose={onClose}
        onSave={onSave}
      />,
      { wrapper }
    );

    const colorFields = getAllByTestId("tier-color-input");
    colorFields.forEach((field) => {
      expect(field).toBeDisabled();
    });
  });

  it("disables `Arrange` arrows if `loading` is true", () => {
    const { getAllByTestId } = render(
      <LoyaltyTiersDialog
        tiers={tiers}
        loading={true}
        onClose={onClose}
        onSave={onSave}
      />,
      { wrapper }
    );

    const arrangeFields = [
      ...getAllByTestId("tier-arrange-down"),
      ...getAllByTestId("tier-arrange-up")
    ];
    arrangeFields.forEach((field) => {
      expect(field).toBeDisabled();
    });
  });

  it("calls `onClose` if `Cancel` is clicked", () => {
    const { getByText } = render(
      <LoyaltyTiersDialog
        tiers={tiers}
        loading={false}
        onClose={onClose}
        onSave={onSave}
      />,
      { wrapper }
    );

    expect(onClose).not.toHaveBeenCalled();
    fireEvent.click(getByText("Cancel"));
    expect(onClose).toHaveBeenCalled();
  });

  it("returns the tier list as is if `Save` is clicked without changes", () => {
    const { getByText } = render(
      <LoyaltyTiersDialog
        tiers={tiers}
        loading={false}
        onClose={onClose}
        onSave={onSave}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Save"));
    expect(onSave).toHaveBeenCalledWith(tiers);
  });

  it("can return a tier list with modified `color` values", () => {
    const { getAllByTestId, getByText } = render(
      <LoyaltyTiersDialog
        tiers={tiers}
        loading={false}
        onClose={onClose}
        onSave={onSave}
      />,
      { wrapper }
    );

    const colorFields = getAllByTestId("tier-color-input");
    fireEvent.change(colorFields[0], { target: { value: "#aa11aa" } });
    fireEvent.change(colorFields[1], { target: { value: "#bb11bb" } });
    fireEvent.change(colorFields[2], { target: { value: "#cc11cc" } });
    fireEvent.change(colorFields[3], { target: { value: "#dd11dd" } });
    // wait for debounce on color change
    act(() => {
      jest.advanceTimersByTime(50);
    });

    const expected = produce(tiers, (draft) => {
      draft[0].color = "#aa11aa";
      draft[1].color = "#bb11bb";
      draft[2].color = "#cc11cc";
      draft[3].color = "#dd11dd";
    });
    fireEvent.click(getByText("Save"));
    expect(onSave).toHaveBeenCalledWith(expected);
  });

  it("can update `Rank Order` of tiers", () => {
    const { getAllByTestId, getByText } = render(
      <LoyaltyTiersDialog
        tiers={tiers}
        loading={false}
        onClose={onClose}
        onSave={onSave}
      />,
      { wrapper }
    );

    const arrangeUps = getAllByTestId("tier-arrange-up");
    const arrangeDowns = getAllByTestId("tier-arrange-down");
    // Given 4 tiers in order [silver, gold, platinum, bronze]
    fireEvent.click(arrangeDowns[0]); // move silver down -> [gold, silver, platinum, bronze]
    fireEvent.click(arrangeUps[2]); // move platinum up -> [gold, platinum, silver, bronze]
    fireEvent.click(arrangeUps[1]); // move platinum up -> [platinum, gold, silver, bronze]
    fireEvent.click(getByText("Save"));

    // order of elements doesn't change, but the rank of each tier should
    const expected = produce(tiers, (draft) => {
      draft[0].order = 3; // silver from rank 1 to 3
      draft[1].order = 2; // gold remains at rank 2
      draft[2].order = 1; // platinum from rank 3 to 1
      draft[3].order = 4; // bronze remains at rank 4
    });
    expect(onSave).toHaveBeenCalledWith(expected);
  });
});

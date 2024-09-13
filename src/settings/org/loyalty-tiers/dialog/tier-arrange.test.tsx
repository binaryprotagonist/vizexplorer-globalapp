import { fireEvent, render } from "@testing-library/react";
import { ThemeProvider } from "../../../../theme";
import { TierArrange } from "./tier-arrange";

describe("<TierArrange />", () => {
  function wrapper({ children }: any) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  it("renders", () => {
    const { getByText } = render(
      <TierArrange numTiers={1} disabled={false} onClick={() => {}} />,
      { wrapper }
    );

    expect(getByText("Arrange")).toBeInTheDocument();
  });

  it("renders Up and Down buttons based on `numTiers`", () => {
    const numTiers = 3;
    const { getAllByTestId } = render(
      <TierArrange numTiers={numTiers} disabled={false} onClick={() => {}} />,
      { wrapper }
    );

    expect(getAllByTestId("tier-arrange-up")).toHaveLength(numTiers);
    expect(getAllByTestId("tier-arrange-down")).toHaveLength(numTiers);
  });

  it("disables only the first Up button", () => {
    const { getAllByTestId } = render(
      <TierArrange numTiers={3} disabled={false} onClick={() => {}} />,
      { wrapper }
    );

    const arrangeUps = getAllByTestId("tier-arrange-up");
    expect(arrangeUps[0]).toBeDisabled();
    expect(arrangeUps[1]).not.toBeDisabled();
    expect(arrangeUps[2]).not.toBeDisabled();
  });

  it("disables only the last Down button", () => {
    const { getAllByTestId } = render(
      <TierArrange numTiers={3} disabled={false} onClick={() => {}} />,
      { wrapper }
    );

    const arrangeDowns = getAllByTestId("tier-arrange-down");
    expect(arrangeDowns[0]).not.toBeDisabled();
    expect(arrangeDowns[1]).not.toBeDisabled();
    expect(arrangeDowns[2]).toBeDisabled();
  });

  it("disables all buttons if `disabled` is true", () => {
    const numTiers = 3;
    const { getAllByTestId } = render(
      <TierArrange numTiers={numTiers} disabled={true} onClick={() => {}} />,
      { wrapper }
    );

    const allArranges = getAllByTestId("tier-arrange", { exact: false });
    expect(allArranges).toHaveLength(numTiers * 2);
    allArranges.forEach((arrange) => {
      expect(arrange).toBeDisabled();
    });
  });

  it("runs onClick with expected parameters", () => {
    const onClick = jest.fn();
    const { getAllByTestId } = render(
      <TierArrange numTiers={3} disabled={false} onClick={onClick} />,
      { wrapper }
    );

    const arrangeUps = getAllByTestId("tier-arrange-up");
    arrangeUps.forEach((up, idx) => {
      if (idx === 0) return; // first instance is disabled
      fireEvent.click(up);
      // since the first one is skipped, the idx is ahead by 1 of the mock calls
      expect(onClick.mock.calls[idx - 1]).toEqual([idx, "up"]);
    });

    onClick.mockClear();
    const arrangeDowns = getAllByTestId("tier-arrange-down");
    arrangeDowns.forEach((down, idx) => {
      if (idx === arrangeDowns.length - 1) return; // last instance is disabled
      fireEvent.click(down);
      expect(onClick.mock.calls[idx]).toEqual([idx, "down"]);
    });
  });
});

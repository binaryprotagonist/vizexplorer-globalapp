import { render } from "@testing-library/react";
import { ThemeProvider } from "../../../../theme";
import { TierDetail } from "./tier-detail";
import { LoyaltyTierFragment } from "generated-graphql";
import { generateDummyLoyaltyTiers } from "../../../../view/testing/mocks";
import { TIER_ITEM_TOP_Y } from "./utils";

describe("<TierDetail />", () => {
  let tiers: LoyaltyTierFragment[] = [];
  let tierOrder: string[] = [];

  beforeEach(() => {
    tiers = generateDummyLoyaltyTiers(3);
    tierOrder = tiers.map((t) => t.id);
  });

  function wrapper({ children }: any) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  it("renders", () => {
    const { getByTestId } = render(
      <TierDetail
        tiers={tiers}
        tierOrder={tierOrder}
        onColorChange={() => {}}
        disabled={false}
      />,
      { wrapper }
    );

    expect(getByTestId("tier-detail")).toBeInTheDocument();
  });

  it("renders Tier names", () => {
    const { getByText } = render(
      <TierDetail
        tiers={tiers}
        tierOrder={tierOrder}
        onColorChange={() => {}}
        disabled={false}
      />,
      { wrapper }
    );

    tiers.forEach((tier) => {
      expect(getByText(tier.name)).toBeInTheDocument();
    });
  });

  it("renders Tier colors", () => {
    const { getAllByTestId } = render(
      <TierDetail
        tiers={tiers}
        tierOrder={tierOrder}
        onColorChange={() => {}}
        disabled={false}
      />,
      { wrapper }
    );

    const colorPickers = getAllByTestId("tier-color-input");
    colorPickers.forEach((picker, idx) => {
      expect(picker).toHaveAttribute("value", tiers[idx].color);
    });
  });

  it("renders absolute position based on rank order", () => {
    // mix order
    tierOrder = [tiers[1].id, tiers[0].id, tiers[2].id];
    const { getAllByTestId } = render(
      <TierDetail
        tiers={tiers}
        tierOrder={tierOrder}
        onColorChange={() => {}}
        disabled={false}
      />,
      { wrapper }
    );

    const rows = getAllByTestId("tier-detail-row");
    // rows[0] is at tierOrder[1], so position should be index (1) * TIER_ITEM_TOP_Y
    expect(rows[0]).toHaveStyle(`transform: translateY(${1 * TIER_ITEM_TOP_Y}px)`);
    // despite being in second position due to absolute positioning, the the element contains the first tiers detail
    expect(rows[0]).toHaveTextContent(tiers[0].name);

    // rows[1] = tierOrder[0]
    expect(rows[1]).toHaveStyle(`transform: translateY(${0 * TIER_ITEM_TOP_Y}px)`);
    expect(rows[1]).toHaveTextContent(tiers[1].name);

    // rows[2] = tierOrder[2]
    expect(rows[2]).toHaveStyle(`transform: translateY(${2 * TIER_ITEM_TOP_Y}px)`);
    expect(rows[2]).toHaveTextContent(tiers[2].name);
  });
});

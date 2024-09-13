import { render } from "@testing-library/react";
import { ThemeProvider } from "../../../../theme";
import { TierOrder } from "./tier-order";

describe("<TierOrder />", () => {
  function wrapper({ children }: any) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  it("renders", () => {
    const { getByText } = render(<TierOrder numTiers={1} />, { wrapper });

    expect(getByText("Rank Order")).toBeInTheDocument();
  });

  it("renders numbers based on `numTiers`, starting from 1", () => {
    const numTiers = 10;
    const { getByText } = render(<TierOrder numTiers={numTiers} />, {
      wrapper
    });

    Array(numTiers)
      .fill(null)
      .forEach((_, idx) => {
        expect(getByText(`${idx + 1}`)).toBeInTheDocument();
      });
  });
});

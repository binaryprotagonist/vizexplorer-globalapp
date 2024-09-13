import { render } from "@testing-library/react";
import { MarketingProgramDetail } from "./marketing-program-detail";
import { MarketingProgramCardProgramDetailFragment } from "./__generated__/marketing-program-detail";
import { formatDateString } from "./utils";

const mockProgramDetail: MarketingProgramCardProgramDetailFragment = {
  startDate: "2022-01-01",
  dueDate: "2022-02-01",
  modifiedAt: "2024-06-01",
  guestsSelected: 50,
  actionsCreated: 8
};

describe("<MarketingProgramDetail />", () => {
  it("renders", () => {
    const { getByTestId } = render(
      <MarketingProgramDetail programDetail={mockProgramDetail} />
    );

    expect(getByTestId("marketing-program-detail")).toBeInTheDocument();
  });

  it("renders program guest selected count", () => {
    const { getByTestId } = render(
      <MarketingProgramDetail programDetail={mockProgramDetail} />
    );

    expect(getByTestId("guests-selected")).toHaveTextContent(
      `${mockProgramDetail.guestsSelected}`
    );
  });

  it("renders program start date", () => {
    const { getByTestId } = render(
      <MarketingProgramDetail programDetail={mockProgramDetail} />
    );

    expect(getByTestId("program-start-date")).toHaveTextContent(
      formatDateString(mockProgramDetail.startDate)
    );
  });

  it("renders program due date", () => {
    const { getByTestId } = render(
      <MarketingProgramDetail programDetail={mockProgramDetail} />
    );

    expect(getByTestId("program-due-date")).toHaveTextContent(
      formatDateString(mockProgramDetail.dueDate)
    );
  });

  it("renders program modified date", () => {
    const { getByTestId } = render(
      <MarketingProgramDetail programDetail={mockProgramDetail} />
    );

    expect(getByTestId("program-modified-date")).toHaveTextContent(
      formatDateString(mockProgramDetail.modifiedAt)
    );
  });

  it("renders program actions created count", () => {
    const { getByTestId } = render(
      <MarketingProgramDetail programDetail={mockProgramDetail} />
    );

    expect(getByTestId("actions-created")).toHaveTextContent(
      `${mockProgramDetail.actionsCreated}`
    );
  });
});

import { render, fireEvent, act } from "@testing-library/react";
import { PdMarketingProgramStatus } from "generated-graphql";
import { MarketingProgramCardProgramFragment } from "./__generated__/marketing-program-card";
import { MarketingProgramCard } from "./marketing-program-card";

const mockProgram: MarketingProgramCardProgramFragment = {
  id: "1",
  name: "Test Program",
  status: PdMarketingProgramStatus.Current,
  startDate: "2022-01-01",
  dueDate: "2022-01-10",
  modifiedAt: "2022-01-07",
  guestsSelected: 1,
  actionsCreated: 1
};

describe("<MarketingProgramCard />", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <MarketingProgramCard
        program={mockProgram}
        expanded={false}
        onClickAction={() => {}}
        loading={false}
      />
    );

    expect(getByTestId("marketing-program-card")).toBeInTheDocument();
  });

  it("renders Marketing Program Name if loading is false", () => {
    const { getByText } = render(
      <MarketingProgramCard
        program={mockProgram}
        expanded={false}
        onClickAction={() => {}}
        loading={false}
      />
    );

    expect(getByText(mockProgram.name)).toBeInTheDocument();
  });

  it("renders Loading Marketing Program Card if loading is true", () => {
    const { getByTestId, queryByText, queryByTestId } = render(
      <MarketingProgramCard loading={true} />
    );

    expect(getByTestId("loading-card")).toBeInTheDocument();
    expect(queryByText(mockProgram.name)).not.toBeInTheDocument();
    expect(queryByTestId("edit-marketing-program")).not.toBeInTheDocument();
    expect(queryByTestId("stop-marketing-program")).not.toBeInTheDocument();
    expect(queryByTestId("duplicate-marketing-program")).not.toBeInTheDocument();
    expect(queryByTestId("delete-marketing-program")).not.toBeInTheDocument();
    expect(queryByTestId("remove-marketing-program")).not.toBeInTheDocument();
  });

  it("renders `Current` tag when program status is Current", () => {
    const { getByTestId } = render(
      <MarketingProgramCard
        program={mockProgram}
        expanded={false}
        onClickAction={() => {}}
        loading={false}
      />
    );

    expect(getByTestId("marketing-program-status")).toHaveTextContent("Current");
  });

  it("renders `Future` tag when program status is Future", () => {
    const { getByTestId } = render(
      <MarketingProgramCard
        program={{ ...mockProgram, status: PdMarketingProgramStatus.Future }}
        expanded={false}
        onClickAction={() => {}}
        loading={false}
      />
    );

    expect(getByTestId("marketing-program-status")).toHaveTextContent("Future");
  });

  it("doesn't render any tag when program status is History", () => {
    const { queryByTestId } = render(
      <MarketingProgramCard
        program={{ ...mockProgram, status: PdMarketingProgramStatus.History }}
        expanded={false}
        onClickAction={() => {}}
        loading={false}
      />
    );

    expect(queryByTestId("marketing-program-status")).not.toBeInTheDocument();
  });

  it("clicking on expand/collapse button calls onClickAction", () => {
    const mockOnClickAction = jest.fn();
    const { getByTestId } = render(
      <MarketingProgramCard
        program={mockProgram}
        expanded={false}
        onClickAction={mockOnClickAction}
        loading={false}
      />
    );

    fireEvent.click(getByTestId("expand-marketing-program"));
    expect(mockOnClickAction).toHaveBeenCalledWith("expand-collapse", expect.any(Object));
  });

  it("calls onClickAction when clicking on edit icon", () => {
    const mockOnClickAction = jest.fn();
    const { getByTestId } = render(
      <MarketingProgramCard
        program={mockProgram}
        expanded={false}
        onClickAction={mockOnClickAction}
        loading={false}
      />
    );

    fireEvent.click(getByTestId("edit-marketing-program"));
    expect(mockOnClickAction).toHaveBeenCalledWith("edit", mockProgram);
  });

  it("calls onClickAction when clicking on stop icon", () => {
    const mockOnClickAction = jest.fn();
    const { getByTestId } = render(
      <MarketingProgramCard
        program={mockProgram}
        expanded={false}
        onClickAction={mockOnClickAction}
        loading={false}
      />
    );

    fireEvent.click(getByTestId("stop-marketing-program"));
    expect(mockOnClickAction).toHaveBeenCalledWith("stop", mockProgram);
  });

  it("calls onClickAction when clicking on duplicate icon", () => {
    const mockOnClickAction = jest.fn();
    const { getByTestId } = render(
      <MarketingProgramCard
        program={mockProgram}
        expanded={false}
        onClickAction={mockOnClickAction}
        loading={false}
      />
    );

    fireEvent.click(getByTestId("duplicate-marketing-program"));
    expect(mockOnClickAction).toHaveBeenCalledWith("duplicate", mockProgram);
  });

  it("calls onClickAction when clicking on delete icon", () => {
    const mockOnClickAction = jest.fn();
    const { getByTestId } = render(
      <MarketingProgramCard
        program={{ ...mockProgram, status: PdMarketingProgramStatus.Future }}
        expanded={false}
        onClickAction={mockOnClickAction}
        loading={false}
      />
    );

    fireEvent.click(getByTestId("delete-marketing-program"));

    expect(mockOnClickAction).toHaveBeenCalledWith("delete", {
      ...mockProgram,
      status: PdMarketingProgramStatus.Future
    });
  });

  it("calls onClickAction when clicking on remove icon", () => {
    const mockOnClickAction = jest.fn();
    const { getByTestId } = render(
      <MarketingProgramCard
        program={{ ...mockProgram, status: PdMarketingProgramStatus.History }}
        expanded={false}
        onClickAction={mockOnClickAction}
        loading={false}
      />
    );

    fireEvent.click(getByTestId("remove-marketing-program"));
    expect(mockOnClickAction).toHaveBeenCalledWith("remove", {
      ...mockProgram,
      status: PdMarketingProgramStatus.History
    });
  });

  it("renders expected tooltip for edit program action", () => {
    const { getByTestId, getByRole } = render(
      <MarketingProgramCard
        program={mockProgram}
        expanded={false}
        onClickAction={() => {}}
        loading={false}
      />
    );

    fireEvent.mouseOver(getByTestId("edit-marketing-program"));

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent("Edit");
  });

  it("renders expected tooltip for duplicate program action", () => {
    const { getByTestId, getByRole } = render(
      <MarketingProgramCard
        program={mockProgram}
        expanded={false}
        onClickAction={() => {}}
        loading={false}
      />
    );

    fireEvent.mouseOver(getByTestId("duplicate-marketing-program"));

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent("Duplicate");
  });

  it("renders expected tooltip for stop program action", () => {
    const { getByTestId, getByRole } = render(
      <MarketingProgramCard
        program={mockProgram}
        expanded={false}
        onClickAction={() => {}}
        loading={false}
      />
    );

    fireEvent.mouseOver(getByTestId("stop-marketing-program"));

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent("Click to stop");
  });

  it("renders expected tooltip for delete program action", () => {
    const { getByTestId, getByRole } = render(
      <MarketingProgramCard
        program={{ ...mockProgram, status: PdMarketingProgramStatus.Future }}
        expanded={false}
        onClickAction={() => {}}
        loading={false}
      />
    );

    fireEvent.mouseOver(getByTestId("delete-marketing-program"));

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent("Delete");
  });

  it("renders expected tooltip for remove program action", () => {
    const { getByTestId, getByRole } = render(
      <MarketingProgramCard
        program={{ ...mockProgram, status: PdMarketingProgramStatus.History }}
        expanded={false}
        onClickAction={() => {}}
        loading={false}
      />
    );

    fireEvent.mouseOver(getByTestId("remove-marketing-program"));

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent("Click to remove");
  });

  it("displays duplicate,edit and stop actions when program status is `Current` ", () => {
    const { getByTestId } = render(
      <MarketingProgramCard
        program={{ ...mockProgram, status: PdMarketingProgramStatus.Current }}
        expanded={false}
        onClickAction={() => {}}
        loading={false}
      />
    );

    expect(getByTestId("duplicate-marketing-program")).toBeInTheDocument();
    expect(getByTestId("edit-marketing-program")).toBeInTheDocument();
    expect(getByTestId("stop-marketing-program")).toBeInTheDocument();
  });

  it("displays duplicate,edit and delete actions when program status is `Future`", () => {
    const { getByTestId } = render(
      <MarketingProgramCard
        program={{ ...mockProgram, status: PdMarketingProgramStatus.Future }}
        expanded={false}
        onClickAction={() => {}}
        loading={false}
      />
    );

    expect(getByTestId("duplicate-marketing-program")).toBeInTheDocument();
    expect(getByTestId("edit-marketing-program")).toBeInTheDocument();
    expect(getByTestId("delete-marketing-program")).toBeInTheDocument();
  });

  it("displays duplicate and remove actions when program status is `History`", () => {
    const { getByTestId } = render(
      <MarketingProgramCard
        program={{ ...mockProgram, status: PdMarketingProgramStatus.History }}
        expanded={false}
        onClickAction={() => {}}
        loading={false}
      />
    );

    expect(getByTestId("duplicate-marketing-program")).toBeInTheDocument();
    expect(getByTestId("remove-marketing-program")).toBeInTheDocument();
  });
});

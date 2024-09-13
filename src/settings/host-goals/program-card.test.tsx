import { render, fireEvent } from "@testing-library/react";
import { ProgramCard } from "./program-card";
import { ProgramCardProgramFragment } from "./__generated__/program-card";
import { PdGoalProgramStatus } from "generated-graphql";

const mockProgram: ProgramCardProgramFragment = {
  id: "1",
  name: "Test Program",
  status: PdGoalProgramStatus.Current,
  startDate: "2022-01-01",
  endDate: "2022-02-01",
  metrics: [{ id: "theo-win", name: "Theo Win" }],
  members: [{ id: "1", firstName: "John", lastName: "Doe" }]
};

describe("<ProgramCard />", () => {
  it("renders", () => {
    const { getByTestId } = render(
      <ProgramCard
        program={mockProgram}
        expanded={false}
        onClickAction={() => {}}
        loading={false}
      />
    );

    expect(getByTestId("program-card")).toBeInTheDocument();
  });

  it("renders Program Name if loading is false", () => {
    const { getByText } = render(
      <ProgramCard
        program={mockProgram}
        expanded={false}
        onClickAction={() => {}}
        loading={false}
      />
    );

    expect(getByText(mockProgram.name)).toBeInTheDocument();
  });

  it("doesn't render Program Name if loading is true", () => {
    const { getByTestId, queryByText } = render(<ProgramCard loading={true} />);

    expect(getByTestId("name-skeleton")).toBeInTheDocument();
    expect(queryByText(mockProgram.name)).not.toBeInTheDocument();
  });

  it("renders `Current` tag when program status is Current", () => {
    const { getByTestId } = render(
      <ProgramCard
        program={mockProgram}
        expanded={false}
        onClickAction={() => {}}
        loading={false}
      />
    );

    expect(getByTestId("program-status")).toHaveTextContent("Current");
  });

  it("renders `Future` tag when program status is Future", () => {
    const { getByTestId } = render(
      <ProgramCard
        program={{ ...mockProgram, status: PdGoalProgramStatus.Future }}
        expanded={false}
        onClickAction={() => {}}
        loading={false}
      />
    );

    expect(getByTestId("program-status")).toHaveTextContent("Future");
  });

  it("doesn't render any tag when program status is History", () => {
    const { queryByTestId } = render(
      <ProgramCard
        program={{ ...mockProgram, status: PdGoalProgramStatus.History }}
        expanded={false}
        onClickAction={() => {}}
        loading={false}
      />
    );

    expect(queryByTestId("program-status")).not.toBeInTheDocument();
  });

  it("clicking on expand/collapse button calls onClickAction", () => {
    const mockOnClickAction = jest.fn();
    const { getByTestId } = render(
      <ProgramCard
        program={mockProgram}
        expanded={false}
        onClickAction={mockOnClickAction}
        loading={false}
      />
    );

    fireEvent.click(getByTestId("expand-program"));
    expect(mockOnClickAction).toHaveBeenCalledWith("expand-collapse", expect.any(Object));
  });

  it("calls onClickAction when clicking on edit icon", () => {
    const mockOnClickAction = jest.fn();
    const { getByTestId } = render(
      <ProgramCard
        program={mockProgram}
        expanded={false}
        onClickAction={mockOnClickAction}
        loading={false}
      />
    );

    fireEvent.click(getByTestId("edit-program"));
    expect(mockOnClickAction).toHaveBeenCalledWith("edit", mockProgram);
  });

  it("calls onClickAction when clicking on delete icon", () => {
    const mockOnClickAction = jest.fn();
    const { getByTestId } = render(
      <ProgramCard
        program={mockProgram}
        expanded={false}
        onClickAction={mockOnClickAction}
        loading={false}
      />
    );

    fireEvent.click(getByTestId("delete-program"));
    expect(mockOnClickAction).toHaveBeenCalledWith("delete", mockProgram);
  });

  it("calls onClickAction when clicking on duplicate icon", () => {
    const mockOnClickAction = jest.fn();
    const { getByTestId } = render(
      <ProgramCard
        program={mockProgram}
        expanded={false}
        onClickAction={mockOnClickAction}
        loading={false}
      />
    );

    fireEvent.click(getByTestId("duplicate-program"));
    expect(mockOnClickAction).toHaveBeenCalledWith("duplicate", mockProgram);
  });

  it("displays edit,delete and duplicate actions when program status is `Active` ", () => {
    const { getByTestId } = render(
      <ProgramCard
        program={mockProgram}
        expanded={false}
        onClickAction={() => {}}
        loading={false}
      />
    );

    expect(getByTestId("edit-program")).toBeInTheDocument();
    expect(getByTestId("delete-program")).toBeInTheDocument();
    expect(getByTestId("duplicate-program")).toBeInTheDocument();
  });

  it("displays only duplicate action when program status is `History` ", () => {
    const { getByTestId, queryByTestId } = render(
      <ProgramCard
        program={{ ...mockProgram, status: PdGoalProgramStatus.History }}
        expanded={false}
        onClickAction={() => {}}
        loading={false}
      />
    );

    expect(queryByTestId("edit-program")).not.toBeInTheDocument();
    expect(queryByTestId("delete-program")).not.toBeInTheDocument();
    expect(getByTestId("duplicate-program")).toBeInTheDocument();
  });

  it("disables actions if loading is true", () => {
    const { getByTestId } = render(<ProgramCard loading={true} />);

    expect(getByTestId("edit-program")).toBeDisabled();
    expect(getByTestId("delete-program")).toBeDisabled();
    expect(getByTestId("duplicate-program")).toBeDisabled();
  });

  it("calls onClickAction when clicking on program name", () => {
    const mockOnClickAction = jest.fn();
    const { getByTestId } = render(
      <ProgramCard
        program={mockProgram}
        expanded={false}
        onClickAction={mockOnClickAction}
        loading={false}
      />
    );

    fireEvent.click(getByTestId("program-name"));
    expect(mockOnClickAction).toHaveBeenCalledWith("name", mockProgram);
  });

  it("renders program detail if expanded is true", () => {
    const { getByTestId } = render(
      <ProgramCard
        expanded
        program={mockProgram}
        onClickAction={() => {}}
        loading={false}
      />
    );

    expect(getByTestId("program-detail")).toBeInTheDocument();
  });

  it("doesn't render program detail if expanded is false", () => {
    const { queryByTestId } = render(
      <ProgramCard
        expanded={false}
        program={mockProgram}
        onClickAction={() => {}}
        loading={false}
      />
    );

    expect(queryByTestId("program-detail")).not.toBeInTheDocument();
  });
});

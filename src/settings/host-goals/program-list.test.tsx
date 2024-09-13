import { fireEvent, render, within } from "@testing-library/react";
import { ProgramList } from "./program-list";
import { ProgramCardProgramFragment } from "./__generated__/program-card";
import { generateDummyPrograms } from "./__mocks__/host-goals";
import { produce } from "immer";
import { PdGoalProgramStatus } from "generated-graphql";

describe("<ProgramList />", () => {
  const mockPrograms: ProgramCardProgramFragment[] = generateDummyPrograms(3);

  it("renders", () => {
    const { getByTestId } = render(
      <ProgramList
        loading={false}
        programList={mockPrograms}
        handleProgramActionClick={() => {}}
      />
    );

    expect(getByTestId("program-list")).toBeInTheDocument();
  });

  it("renders program cards", () => {
    const { getAllByTestId } = render(
      <ProgramList
        loading={false}
        programList={mockPrograms}
        handleProgramActionClick={() => {}}
      />
    );

    expect(getAllByTestId("program-card")).toHaveLength(mockPrograms.length);
  });

  it("calls `handleProgramActionClick` on clicking program name", () => {
    const mockCallback = jest.fn();
    const { getAllByTestId } = render(
      <ProgramList
        loading={false}
        programList={mockPrograms}
        handleProgramActionClick={mockCallback}
      />
    );

    const programs = getAllByTestId("program-card");
    fireEvent.click(within(programs[0]).getByTestId("program-name"));

    expect(mockCallback).toHaveBeenCalledWith("name", mockPrograms[0]);
  });

  it("calls `handleProgramActionClick` for edit icon click", () => {
    const mockCallback = jest.fn();
    const { getAllByTestId } = render(
      <ProgramList
        loading={false}
        programList={mockPrograms}
        handleProgramActionClick={mockCallback}
      />
    );

    const programs = getAllByTestId("program-card");
    fireEvent.click(within(programs[0]).getByTestId("edit-program"));

    expect(mockCallback).toHaveBeenCalledWith("edit", mockPrograms[0]);
  });

  it("calls `handleProgramActionClick` for duplicate icon click", () => {
    const mockCallback = jest.fn();
    const { getAllByTestId } = render(
      <ProgramList
        loading={false}
        programList={mockPrograms}
        handleProgramActionClick={mockCallback}
      />
    );

    const programs = getAllByTestId("program-card");
    fireEvent.click(within(programs[0]).getByTestId("duplicate-program"));

    expect(mockCallback).toHaveBeenCalledWith("duplicate", mockPrograms[0]);
  });

  it("calls `handleProgramActionClick` for delete icon click", () => {
    const mockCallback = jest.fn();
    const { getAllByTestId } = render(
      <ProgramList
        loading={false}
        programList={mockPrograms}
        handleProgramActionClick={mockCallback}
      />
    );

    const programs = getAllByTestId("program-card");
    fireEvent.click(within(programs[0]).getByTestId("delete-program"));

    expect(mockCallback).toHaveBeenCalledWith("delete", mockPrograms[0]);
  });

  it("renders `ACTIVE PROGRAMS` title if there are active programs", () => {
    const programs = produce(generateDummyPrograms(2), (draft) => {
      draft[0].status = PdGoalProgramStatus.Current;
      draft[1].status = PdGoalProgramStatus.Future;
    });
    const { getByText } = render(
      <ProgramList
        loading={false}
        programList={programs}
        handleProgramActionClick={() => {}}
      />
    );

    expect(getByText("ACTIVE PROGRAMS")).toBeInTheDocument();
  });

  it("doesn't render `ACTIVE PROGRAMS` title if there are no active programs", () => {
    const programs = produce(generateDummyPrograms(2), (draft) => {
      draft[0].status = PdGoalProgramStatus.History;
      draft[1].status = PdGoalProgramStatus.History;
    });
    const { queryByText } = render(
      <ProgramList
        loading={false}
        programList={programs}
        handleProgramActionClick={() => {}}
      />
    );

    expect(queryByText("ACTIVE PROGRAMS")).not.toBeInTheDocument();
  });

  it("renders `HISTORY` title if there are programs in history", () => {
    const programs = produce(generateDummyPrograms(2), (draft) => {
      draft[0].status = PdGoalProgramStatus.History;
      draft[1].status = PdGoalProgramStatus.History;
    });
    const { getByText } = render(
      <ProgramList
        loading={false}
        programList={programs}
        handleProgramActionClick={() => {}}
      />
    );

    expect(getByText("HISTORY")).toBeInTheDocument();
  });

  it("doesn't render `HISTORY` title if there are no programs in history", () => {
    const programs = produce(generateDummyPrograms(2), (draft) => {
      draft[0].status = PdGoalProgramStatus.Current;
      draft[1].status = PdGoalProgramStatus.Future;
    });
    const { queryByText } = render(
      <ProgramList
        loading={false}
        programList={programs}
        handleProgramActionClick={() => {}}
      />
    );

    expect(queryByText("HISTORY")).not.toBeInTheDocument();
  });
});

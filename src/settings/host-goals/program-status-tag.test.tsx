import { act, fireEvent, render } from "@testing-library/react";
import { ProgramStatusTag } from "./program-status-tag";
import { PdGoalProgramStatus } from "generated-graphql";
import { globalDefaultColors } from "@vizexplorer/global-ui-v2";

describe("<ProgramStatusTag />", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <ProgramStatusTag status={PdGoalProgramStatus.Current} />
    );

    expect(getByTestId("program-status")).toBeInTheDocument();
  });

  it("renders expected label for Current status", () => {
    const { getByTestId } = render(
      <ProgramStatusTag status={PdGoalProgramStatus.Current} />
    );

    expect(getByTestId("program-status")).toHaveTextContent("Current");
  });

  it("renders expected label for Future status", () => {
    const { getByTestId } = render(
      <ProgramStatusTag status={PdGoalProgramStatus.Future} />
    );

    expect(getByTestId("program-status")).toHaveTextContent("Future");
  });

  it("renders an empty label for History status", () => {
    const { getByTestId } = render(
      <ProgramStatusTag status={PdGoalProgramStatus.History} />
    );

    expect(getByTestId("program-status")).toHaveTextContent("");
  });

  it("renders a success color for Current status", () => {
    const { getByTestId } = render(
      <ProgramStatusTag status={PdGoalProgramStatus.Current} />
    );

    expect(getByTestId("program-status")).toHaveStyle({
      color: globalDefaultColors.success[700]
    });
  });

  it("renders a warning color for Future status", () => {
    const { getByTestId } = render(
      <ProgramStatusTag status={PdGoalProgramStatus.Future} />
    );

    expect(getByTestId("program-status")).toHaveStyle({
      color: globalDefaultColors.warning[700]
    });
  });

  it("renders a grey color for History status", () => {
    const { getByTestId } = render(
      <ProgramStatusTag status={PdGoalProgramStatus.History} />
    );

    expect(getByTestId("program-status")).toHaveStyle({
      color: globalDefaultColors.grey[700]
    });
  });

  it("renders expected tooltip for Current status", () => {
    const { getByTestId, getByRole } = render(
      <ProgramStatusTag status={PdGoalProgramStatus.Current} />
    );

    fireEvent.mouseOver(getByTestId("program-status"));
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent("Active programs");
  });

  it("renders expected tooltip for Future status", () => {
    const { getByTestId, getByRole } = render(
      <ProgramStatusTag status={PdGoalProgramStatus.Future} />
    );

    fireEvent.mouseOver(getByTestId("program-status"));
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent("Programs scheduled");
  });

  it("doesn't render tooltip for History status", () => {
    const { getByTestId, queryByRole } = render(
      <ProgramStatusTag status={PdGoalProgramStatus.History} />
    );

    fireEvent.mouseOver(getByTestId("program-status"));
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(queryByRole("tooltip")).not.toBeInTheDocument();
  });
});

import { render } from "@testing-library/react";
import { ProgramDashboardHeader } from "./program-dashboard-header";
import { ProgramDashboardHeaderMetaFragment } from "./__generated__/program-dashboard-header";
import { PdGoalProgramStatus } from "generated-graphql";

const meta: ProgramDashboardHeaderMetaFragment = {
  name: "Goal 1",
  status: PdGoalProgramStatus.Current,
  startDate: "2022-01-01",
  endDate: "2022-02-01",
  createdAt: "2021-12-01",
  modifiedAt: "2021-12-15"
};

describe("<ProgramDashboardHeader />", () => {
  it("renders", () => {
    const { getByTestId } = render(
      <ProgramDashboardHeader meta={meta} siteName={"Site 1"} />
    );

    expect(getByTestId("program-dashboard-header")).toBeInTheDocument();
  });

  it("displays the program name", () => {
    const { getByText } = render(
      <ProgramDashboardHeader meta={meta} siteName={"Site 1"} />
    );

    expect(getByText("Goal 1")).toBeInTheDocument();
  });

  it("displays program status if the status is Current", () => {
    const { getByTestId } = render(
      <ProgramDashboardHeader meta={meta} siteName={"Site 1"} />
    );

    expect(getByTestId("program-status")).toBeInTheDocument();
  });

  it("displays program status is the status is Future", () => {
    const { getByTestId } = render(
      <ProgramDashboardHeader
        meta={{ ...meta, status: PdGoalProgramStatus.Future }}
        siteName={"Site 1"}
      />
    );

    expect(getByTestId("program-status")).toBeInTheDocument();
  });

  it("doesn't display program status if the status is History", () => {
    const { queryByTestId } = render(
      <ProgramDashboardHeader
        meta={{ ...meta, status: PdGoalProgramStatus.History }}
        siteName={"Site 1"}
      />
    );

    expect(queryByTestId("program-status")).not.toBeInTheDocument();
  });

  it("displays the site name", () => {
    const { getByText } = render(
      <ProgramDashboardHeader meta={meta} siteName={"Site 1"} />
    );

    expect(getByText("Site 1")).toBeInTheDocument();
  });

  it("displays the program attributes and values", () => {
    const { getByTestId } = render(
      <ProgramDashboardHeader meta={meta} siteName={"Site 1"} />
    );

    expect(getByTestId("start-date")).toHaveTextContent("01 January 2022");
    expect(getByTestId("end-date")).toHaveTextContent("01 February 2022");
    expect(getByTestId("creation-date")).toHaveTextContent("01 December 2021");
    expect(getByTestId("last-update")).toHaveTextContent("15 December 2021");
  });

  it("displays no last updates text if modifiedAt is the same as createdAt", () => {
    const { getByTestId } = render(
      <ProgramDashboardHeader
        meta={{ ...meta, modifiedAt: meta.createdAt }}
        siteName={"Site 1"}
      />
    );

    expect(getByTestId("last-update")).toHaveTextContent("no updates");
  });

  it("displays no last updates text if modifiedAt is null", () => {
    const { getByTestId } = render(
      <ProgramDashboardHeader meta={{ ...meta, modifiedAt: null }} siteName={"Site 1"} />
    );

    expect(getByTestId("last-update")).toHaveTextContent("no updates");
  });
});

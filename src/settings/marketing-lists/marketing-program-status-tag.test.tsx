import { act, fireEvent, render } from "@testing-library/react";
import { PdMarketingProgramStatus } from "generated-graphql";
import { globalDefaultColors } from "@vizexplorer/global-ui-v2";
import { MarketingProgramStatusTag } from "./marketing-program-status-tag";

describe("<MarketingProgramStatusTag />", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <MarketingProgramStatusTag status={PdMarketingProgramStatus.Current} />
    );

    expect(getByTestId("marketing-program-status")).toBeInTheDocument();
  });

  it("renders expected label for Current status", () => {
    const { getByTestId } = render(
      <MarketingProgramStatusTag status={PdMarketingProgramStatus.Current} />
    );

    expect(getByTestId("marketing-program-status")).toHaveTextContent("Current");
  });

  it("renders expected label for Future status", () => {
    const { getByTestId } = render(
      <MarketingProgramStatusTag status={PdMarketingProgramStatus.Future} />
    );

    expect(getByTestId("marketing-program-status")).toHaveTextContent("Future");
  });

  it("renders an empty label for History status", () => {
    const { getByTestId } = render(
      <MarketingProgramStatusTag status={PdMarketingProgramStatus.History} />
    );

    expect(getByTestId("marketing-program-status")).toHaveTextContent("");
  });

  it("renders a success color for Current status", () => {
    const { getByTestId } = render(
      <MarketingProgramStatusTag status={PdMarketingProgramStatus.Current} />
    );

    expect(getByTestId("marketing-program-status")).toHaveStyle({
      color: globalDefaultColors.success[700]
    });
  });

  it("renders a warning color for Future status", () => {
    const { getByTestId } = render(
      <MarketingProgramStatusTag status={PdMarketingProgramStatus.Future} />
    );

    expect(getByTestId("marketing-program-status")).toHaveStyle({
      color: globalDefaultColors.warning[700]
    });
  });

  it("renders a grey color for History status", () => {
    const { getByTestId } = render(
      <MarketingProgramStatusTag status={PdMarketingProgramStatus.History} />
    );

    expect(getByTestId("marketing-program-status")).toHaveStyle({
      color: globalDefaultColors.grey[700]
    });
  });

  it("renders expected tooltip for Current status", () => {
    const { getByTestId, getByRole } = render(
      <MarketingProgramStatusTag status={PdMarketingProgramStatus.Current} />
    );

    fireEvent.mouseOver(getByTestId("marketing-program-status"));
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent("Active actions");
  });

  it("renders expected tooltip for Future status", () => {
    const { getByTestId, getByRole } = render(
      <MarketingProgramStatusTag status={PdMarketingProgramStatus.Future} />
    );

    fireEvent.mouseOver(getByTestId("marketing-program-status"));
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent("Actions scheduled");
  });

  it("doesn't render tooltip for History status", () => {
    const { getByTestId, queryByRole } = render(
      <MarketingProgramStatusTag status={PdMarketingProgramStatus.History} />
    );

    fireEvent.mouseOver(getByTestId("marketing-program-status"));
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(queryByRole("tooltip")).not.toBeInTheDocument();
  });
});

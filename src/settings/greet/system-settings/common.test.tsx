import { act, fireEvent, render } from "@testing-library/react";
import { SettingsCard } from "./common";

describe("<SettingsCard />", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders with the provided setting title and helpText", () => {
    const { getByTestId, getByText, getByRole } = render(
      <SettingsCard title={"Example Title"} helpText={"Example Help"} />
    );

    fireEvent.mouseOver(getByTestId("help-tip"));
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(getByText("Example Title")).toBeInTheDocument();
    expect(getByRole("tooltip")).toHaveTextContent("Example Help");
  });
});

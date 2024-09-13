import { fireEvent, render, within } from "@testing-library/react";
import { ApplicationSelect } from "./application-select";
import { generateDummyApplicationSelectApps } from "./__mocks__/application-select";
import { getInput } from "testing/utils";

const mockApps = generateDummyApplicationSelectApps();

describe("<ApplicationSelect", () => {
  it("renders", () => {
    const { getByTestId } = render(
      <ApplicationSelect selected={mockApps[0]} options={mockApps} onChange={() => {}} />
    );

    expect(getByTestId("application-select")).toBeInTheDocument();
  });

  it("renders expected placeholder when selected is null", () => {
    const { getByPlaceholderText } = render(
      <ApplicationSelect selected={null} options={mockApps} onChange={() => {}} />
    );

    expect(getByPlaceholderText("Select application")).toBeInTheDocument();
  });

  it("renders selected app", () => {
    const { getByTestId } = render(
      <ApplicationSelect selected={mockApps[0]} options={mockApps} onChange={() => {}} />
    );

    expect(getInput(getByTestId("application-select"))).toHaveValue(mockApps[0].name);
    expect(getByTestId("app-icon")).toHaveAttribute("src", mockApps[0].icon);
  });

  it("renders app options", () => {
    const { getByTestId, getAllByRole } = render(
      <ApplicationSelect selected={null} options={mockApps} onChange={() => {}} />
    );

    fireEvent.mouseDown(within(getByTestId("application-select")).getByRole("combobox"));

    const appOptions = getAllByRole("option");
    mockApps.forEach((app, idx) => {
      expect(appOptions[idx]).toHaveTextContent(app.name);
      expect(within(appOptions[idx]).getByTestId("app-icon")).toHaveAttribute(
        "src",
        app.icon
      );
    });
  });

  it("disables select when disabled prop is true", () => {
    const { getByTestId } = render(
      <ApplicationSelect
        disabled
        selected={null}
        options={mockApps}
        onChange={() => {}}
      />
    );

    expect(getInput(getByTestId("application-select"))).toBeDisabled();
  });
});

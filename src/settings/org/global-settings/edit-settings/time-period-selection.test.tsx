import { fireEvent, render, within } from "@testing-library/react";
import { produce } from "immer";
import { mockTimePeriods } from "../__mocks__/global-settings";
import { getInput } from "testing/utils";
import { ThemeProvider } from "../../../../theme";
import { timePeriodLabel } from "../utils";
import { TimePeriodSelection } from "./time-period-selection";

const mockTimePeriods1 = produce(mockTimePeriods, (draft) => {
  return draft.map((p, idx) => ({
    ...p,
    enabled: idx % 2 === 0,
    default: idx === 2
  }));
});

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("<TimePeriodSelection />", () => {
  it("renders", () => {
    const { getByTestId } = render(
      <TimePeriodSelection
        title={""}
        initialTimePeriod={[]}
        onCancel={() => {}}
        onSave={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("time-period-selection")).toBeInTheDocument();
  });

  it("renders provided title", () => {
    const { getByText } = render(
      <TimePeriodSelection
        title={"My Title"}
        initialTimePeriod={[]}
        onCancel={() => {}}
        onSave={() => {}}
      />,
      { wrapper }
    );

    expect(getByText("My Title")).toBeInTheDocument();
  });

  it("renders provided time periods", () => {
    const { getAllByTestId } = render(
      <TimePeriodSelection
        title={""}
        initialTimePeriod={mockTimePeriods1}
        onCancel={() => {}}
        onSave={() => {}}
      />,
      { wrapper }
    );

    const timePeriodChecks = getAllByTestId("time-period-check");
    timePeriodChecks.forEach((tp, idx) => {
      expect(tp).toHaveTextContent(timePeriodLabel(mockTimePeriods1[idx]));
      const input = getInput(tp);
      if (mockTimePeriods1[idx].enabled) {
        expect(input).toBeChecked();
      } else {
        expect(input).not.toBeChecked();
      }
    });
  });

  it("renders default time period with some value if a default is set", () => {
    const { getByTestId } = render(
      <TimePeriodSelection
        title={""}
        initialTimePeriod={mockTimePeriods1}
        onCancel={() => {}}
        onSave={() => {}}
      />,
      { wrapper }
    );

    const defaultPeriod = mockTimePeriods1.find((p) => p.default)!;
    expect(getInput(getByTestId("time-period-default"))).toHaveValue(
      timePeriodLabel(defaultPeriod)
    );
  });

  it("doesnt set default time period if there is no default", () => {
    const { getByTestId } = render(
      <TimePeriodSelection
        title={""}
        initialTimePeriod={[mockTimePeriods1[0]]}
        onCancel={() => {}}
        onSave={() => {}}
      />,
      { wrapper }
    );

    expect(getInput(getByTestId("time-period-default"))).toHaveValue("");
  });

  it("only renders default time period options which are enabled", () => {
    const { getByTestId, getByRole } = render(
      <TimePeriodSelection
        title={""}
        initialTimePeriod={mockTimePeriods1}
        onCancel={() => {}}
        onSave={() => {}}
      />,
      { wrapper }
    );

    fireEvent.keyDown(getByTestId("time-period-default"), { keyCode: 40 });

    const defaultPeriodMenu = getByRole("listbox");
    mockTimePeriods1.forEach((p) => {
      if (p.enabled) {
        expect(defaultPeriodMenu).toHaveTextContent(timePeriodLabel(p));
      } else {
        expect(defaultPeriodMenu).not.toHaveTextContent(timePeriodLabel(p));
      }
    });
  });

  it("deselects default time period if the related check option is disabled", () => {
    const { getByTestId } = render(
      <TimePeriodSelection
        title={""}
        initialTimePeriod={mockTimePeriods1}
        onCancel={() => {}}
        onSave={() => {}}
      />,
      { wrapper }
    );

    // verify selected default period
    const defaultPeriod = mockTimePeriods1.find((p) => p.default)!;
    const defaultLabel = timePeriodLabel(defaultPeriod);
    expect(getInput(getByTestId("time-period-default"))).toHaveValue(defaultLabel);

    // deselect period and validate default is reset
    const checkOptions = getByTestId("time-period-check-group");
    fireEvent.click(within(checkOptions).getByText(defaultLabel));
    expect(getInput(getByTestId("time-period-default"))).toHaveValue("");
  });

  it("runs `onSave` with expected value when Save is clicked", () => {
    const mockOnSave = jest.fn();
    const { getByTestId, getAllByTestId, getAllByRole, getByText } = render(
      <TimePeriodSelection
        title={""}
        initialTimePeriod={mockTimePeriods1}
        onCancel={() => {}}
        onSave={mockOnSave}
      />,
      { wrapper }
    );

    fireEvent.click(getAllByTestId("time-period-check")[1]);
    fireEvent.keyDown(getByTestId("time-period-default"), { keyCode: 40 });
    fireEvent.click(getAllByRole("option")[1]);
    fireEvent.click(getByText("Save"));

    const expected = produce(mockTimePeriods1, (draft) => {
      draft[1].enabled = true;
      draft[1].default = true;
      draft[2].default = false;
    });
    expect(mockOnSave).toHaveBeenCalledWith(expected);
  });

  it("runs `onCancel` when Cancel is clicked", () => {
    const mockOnCancel = jest.fn();
    const { getByText } = render(
      <TimePeriodSelection
        title={""}
        initialTimePeriod={mockTimePeriods1}
        onCancel={mockOnCancel}
        onSave={() => {}}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Cancel"));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("disables all fields and actions if `disabled` is true", () => {
    const { getByText, getByTestId, getAllByTestId } = render(
      <TimePeriodSelection
        disabled
        title={""}
        initialTimePeriod={mockTimePeriods1}
        onCancel={() => {}}
        onSave={() => {}}
      />,
      { wrapper }
    );

    const timePeriodChecks = getAllByTestId("time-period-check");
    const timePeriodDefault = getByTestId("time-period-default");

    expect(getByText("Save")).toBeDisabled();
    expect(getByText("Cancel")).toBeDisabled();
    expect(getInput(timePeriodDefault)).toBeDisabled();
    timePeriodChecks.forEach((tp) => {
      expect(getInput(tp)).toBeDisabled();
    });
  });

  it("renders `Save` as disabled if a default value is not selected", () => {
    const initialPeriods = mockTimePeriods1.map((p) => ({
      ...p,
      default: false
    }));
    const { getByText } = render(
      <TimePeriodSelection
        title={""}
        initialTimePeriod={initialPeriods}
        onCancel={() => {}}
        onSave={() => {}}
      />,
      { wrapper }
    );

    expect(getByText("Cancel")).toBeEnabled();
    expect(getByText("Save")).toBeDisabled();
  });
});

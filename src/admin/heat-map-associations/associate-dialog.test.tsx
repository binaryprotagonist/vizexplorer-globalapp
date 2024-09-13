import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { act, fireEvent, render } from "@testing-library/react";
import { format, isSameDay, parseISO } from "date-fns";
import { HeatMapInventoryFragment } from "generated-graphql";
import { getInput, updateInput } from "testing/utils";
import { ThemeProvider } from "../../theme";
import { AssociateDialog } from "./associate-dialog";

const mockHeatMap: HeatMapInventoryFragment = {
  id: "s3://maps/1612171522/file.js",
  uploadedAt: "2021-02-01",
  attributes: {
    date: "2021-02-01",
    floor: "2"
  }
};

function wrapper({ children }: any) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider>{children}</ThemeProvider>
    </LocalizationProvider>
  );
}

describe("<AssociateDialog />", () => {
  it("renders", () => {
    const { getByTestId } = render(
      <AssociateDialog
        heatmap={mockHeatMap}
        existingAssociations={[]}
        onAssociate={() => {}}
        onCancel={() => {}}
        disabled={false}
      />,
      { wrapper }
    );

    expect(getByTestId("associate-heatmap-dialog")).toBeInTheDocument();
  });

  it("sets effectiveDate according to heatmap date if it's valid", () => {
    const { getByTestId } = render(
      <AssociateDialog
        heatmap={mockHeatMap}
        existingAssociations={[]}
        onAssociate={() => {}}
        onCancel={() => {}}
        disabled={false}
      />,
      { wrapper }
    );

    const dateInput = getInput(getByTestId("effective-date-field"));
    expect(dateInput).toHaveValue("02/01/2021");
  });

  it("defaults effectiveDate to today if there is no heatmap date", () => {
    const noDateHeatMap = { ...mockHeatMap, attributes: { floorId: "1" } };
    const { getByTestId } = render(
      <AssociateDialog
        heatmap={noDateHeatMap}
        existingAssociations={[]}
        onAssociate={() => {}}
        onCancel={() => {}}
        disabled={false}
      />,
      { wrapper }
    );

    const dateInput = getInput(getByTestId("effective-date-field"));
    expect(dateInput).toHaveValue(format(new Date(), "MM/dd/yyyy"));
  });

  it("defaults effectiveDate to today if the heatmap date is invalid", () => {
    const noDateHeatMap = { ...mockHeatMap, attributes: { date: "abc" } };
    const { getByTestId } = render(
      <AssociateDialog
        heatmap={noDateHeatMap}
        existingAssociations={[]}
        onAssociate={() => {}}
        onCancel={() => {}}
        disabled={false}
      />,
      { wrapper }
    );

    const dateInput = getInput(getByTestId("effective-date-field"));
    expect(dateInput).toHaveValue(format(new Date(), "MM/dd/yyyy"));
  });

  it("sets floorId according to heatmap floor if it's available", () => {
    const { getByTestId } = render(
      <AssociateDialog
        heatmap={mockHeatMap}
        existingAssociations={[]}
        onAssociate={() => {}}
        onCancel={() => {}}
        disabled={false}
      />,
      { wrapper }
    );

    const floorIdInput = getInput(getByTestId("floor-id-field"));
    expect(floorIdInput).toHaveValue(2);
  });

  it("defaults floorId to 1 if there is no heatmap floor", () => {
    const noDateHeatMap = { ...mockHeatMap, attributes: undefined };
    const { getByTestId } = render(
      <AssociateDialog
        heatmap={noDateHeatMap}
        existingAssociations={[]}
        onAssociate={() => {}}
        onCancel={() => {}}
        disabled={false}
      />,
      { wrapper }
    );

    const floorIdInput = getInput(getByTestId("floor-id-field"));
    expect(floorIdInput).toHaveValue(1);
  });

  it("defaults floorId to 1 if the heatmap floor is invalid", () => {
    const noDateHeatMap = { ...mockHeatMap, attributes: { floor: "abc" } };
    const { getByTestId } = render(
      <AssociateDialog
        heatmap={noDateHeatMap}
        existingAssociations={[]}
        onAssociate={() => {}}
        onCancel={() => {}}
        disabled={false}
      />,
      { wrapper }
    );

    const floorIdInput = getInput(getByTestId("floor-id-field"));
    expect(floorIdInput).toHaveValue(1);
  });

  it("renders file description", () => {
    const { getByText } = render(
      <AssociateDialog
        heatmap={mockHeatMap}
        existingAssociations={[]}
        onAssociate={() => {}}
        onCancel={() => {}}
        disabled={false}
      />,
      { wrapper }
    );

    expect(getByText("file.js")).toBeInTheDocument();
    expect(getByText("Mon, Feb 1, 2021")).toBeInTheDocument();
  });

  it("disables fields and actions if `disabled` is true", () => {
    const { getByText, getByTestId } = render(
      <AssociateDialog
        heatmap={mockHeatMap}
        existingAssociations={[]}
        onAssociate={() => {}}
        onCancel={() => {}}
        disabled={true}
      />,
      { wrapper }
    );

    const dateInput = getInput(getByTestId("effective-date-field"));
    const floorIdInput = getInput(getByTestId("floor-id-field"));
    expect(dateInput).toBeDisabled();
    expect(floorIdInput).toBeDisabled();
    expect(getByText("Cancel")).toBeDisabled();
    expect(getByText("Associate")).toBeDisabled();
  });

  it("doesn't disabled fields and actions if `disabled` is false", () => {
    const { getByText, getByTestId } = render(
      <AssociateDialog
        heatmap={mockHeatMap}
        existingAssociations={[]}
        onAssociate={() => {}}
        onCancel={() => {}}
        disabled={false}
      />,
      { wrapper }
    );

    const dateInput = getInput(getByTestId("effective-date-field"));
    const floorIdInput = getInput(getByTestId("floor-id-field"));
    expect(dateInput).not.toBeDisabled();
    expect(floorIdInput).not.toBeDisabled();
    expect(getByText("Cancel")).not.toBeDisabled();
    expect(getByText("Associate")).not.toBeDisabled();
  });

  it("disables `Associate` action if `effectiveDate` is invalid", () => {
    const { getByText, getByTestId } = render(
      <AssociateDialog
        heatmap={mockHeatMap}
        existingAssociations={[]}
        onAssociate={() => {}}
        onCancel={() => {}}
        disabled={false}
      />,
      { wrapper }
    );

    act(() => {
      updateInput(getByTestId("effective-date-field"), "");
    });

    expect(getByText("Associate")).toBeDisabled();
  });

  it("disables `Associate` action if `effectiveDate` is before 2000-01-01", () => {
    const { getByText, getByTestId } = render(
      <AssociateDialog
        heatmap={mockHeatMap}
        existingAssociations={[]}
        onAssociate={() => {}}
        onCancel={() => {}}
        disabled={false}
      />,
      { wrapper }
    );

    act(() => {
      updateInput(getByTestId("effective-date-field"), "1999-12-31");
    });

    expect(getByText("Associate")).toBeDisabled();
  });

  it("runs `onCancel` when `Cancel` action is clicked", () => {
    const onCancel = jest.fn();
    const { getByText } = render(
      <AssociateDialog
        heatmap={mockHeatMap}
        existingAssociations={[]}
        onAssociate={() => {}}
        onCancel={onCancel}
        disabled={false}
      />,
      { wrapper }
    );

    act(() => {
      fireEvent.click(getByText("Cancel"));
    });

    expect(onCancel).toHaveBeenCalled();
  });

  it("runs `onAssociate` when `Associate` action is clicked", () => {
    const onAssociate = jest.fn();
    const { getByText } = render(
      <AssociateDialog
        heatmap={mockHeatMap}
        existingAssociations={[]}
        onAssociate={onAssociate}
        onCancel={() => {}}
        disabled={false}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Associate"));

    const heatmapDate = parseISO(mockHeatMap.attributes.date);
    const [date, floorId] = onAssociate.mock.calls[0];
    expect(isSameDay(date, heatmapDate)).toBeTruthy();
    expect(floorId).toBe(mockHeatMap.attributes.floor);
  });

  it("displays warning if there is an existing association conflict", () => {
    const { getByText } = render(
      <AssociateDialog
        heatmap={mockHeatMap}
        existingAssociations={[
          {
            date: mockHeatMap.attributes.date,
            floorId: mockHeatMap.attributes.floor
          }
        ]}
        onAssociate={() => {}}
        onCancel={() => {}}
        disabled={false}
      />,
      { wrapper }
    );

    expect(
      getByText("There is already a file for this floor", { exact: false })
    ).toBeInTheDocument();
  });

  it("doesn't display warning if there is not conflict on floorId", () => {
    const { queryByText } = render(
      <AssociateDialog
        heatmap={mockHeatMap}
        existingAssociations={[
          {
            date: new Date().toISOString(),
            floorId: "2"
          }
        ]}
        onAssociate={() => {}}
        onCancel={() => {}}
        disabled={false}
      />,
      { wrapper }
    );

    expect(
      queryByText("There is already a file for this date", { exact: false })
    ).not.toBeInTheDocument();
  });

  it("doesn't display warning if there is not conflict on date", () => {
    const { queryByText } = render(
      <AssociateDialog
        heatmap={mockHeatMap}
        existingAssociations={[
          {
            date: "2022-05-01T04:25:31.730Z",
            floorId: "1"
          }
        ]}
        onAssociate={() => {}}
        onCancel={() => {}}
        disabled={false}
      />,
      { wrapper }
    );

    expect(
      queryByText("There is already a file for this date", { exact: false })
    ).not.toBeInTheDocument();
  });
});

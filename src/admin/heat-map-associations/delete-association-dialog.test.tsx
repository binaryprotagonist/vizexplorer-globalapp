import { fireEvent, render } from "@testing-library/react";
import { OrgHeatMapFragment } from "generated-graphql";
import { ThemeProvider } from "../../theme";
import { DeleteAssociationDialog } from "./delete-association-dialog";

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

const orgHeatMap: OrgHeatMapFragment = {
  id: "ohm-1",
  effectiveFrom: "2021-01-01",
  floorId: "1",
  sourceSiteId: "site-1",
  heatMapId: "s3://maps/1682905190/file.js"
};

describe("<DeleteAssociationDialog />", () => {
  it("renders", () => {
    const { getByTestId } = render(
      <DeleteAssociationDialog
        association={orgHeatMap}
        onDelete={() => {}}
        onCancel={() => {}}
        disabled={false}
      />,
      { wrapper }
    );

    expect(getByTestId("delete-association-dialog")).toBeInTheDocument();
  });

  it("renders association details", () => {
    const { getByTestId } = render(
      <DeleteAssociationDialog
        association={orgHeatMap}
        onDelete={() => {}}
        onCancel={() => {}}
        disabled={false}
      />,
      { wrapper }
    );

    expect(getByTestId("file-name")).toHaveTextContent("file.js");
    expect(getByTestId("effective-from")).toHaveTextContent("Fri, Jan 1, 2021");
    expect(getByTestId("floor-id")).toHaveTextContent("1");
  });

  it("disables actions if `disabled` is true", () => {
    const { getByText } = render(
      <DeleteAssociationDialog
        association={orgHeatMap}
        onDelete={() => {}}
        onCancel={() => {}}
        disabled={true}
      />,
      { wrapper }
    );

    expect(getByText("Cancel")).toBeDisabled();
    expect(getByText("Delete")).toBeDisabled();
  });

  it("doesn't disabled actions if `disabled` is false", () => {
    const { getByText } = render(
      <DeleteAssociationDialog
        association={orgHeatMap}
        onDelete={() => {}}
        onCancel={() => {}}
        disabled={false}
      />,
      { wrapper }
    );

    expect(getByText("Cancel")).not.toBeDisabled();
    expect(getByText("Delete")).not.toBeDisabled();
  });

  it("runs `onCancel` when cancel button is clicked", () => {
    const onCancel = jest.fn();
    const { getByText } = render(
      <DeleteAssociationDialog
        association={orgHeatMap}
        onDelete={() => {}}
        onCancel={onCancel}
        disabled={false}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Cancel"));
    expect(onCancel).toHaveBeenCalled();
  });

  it("runs `onDelete` when delete button is clicked", () => {
    const onDelete = jest.fn();
    const { getByText } = render(
      <DeleteAssociationDialog
        association={orgHeatMap}
        onDelete={onDelete}
        onCancel={() => {}}
        disabled={false}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Delete"));
    expect(onDelete).toHaveBeenCalledWith(orgHeatMap.id);
  });
});

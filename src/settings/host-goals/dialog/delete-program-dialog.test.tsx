import { fireEvent, render } from "@testing-library/react";
import { DeleteProgramDialog } from "./delete-program-dialog";

describe("<DeleteProgramDialog />", () => {
  it("renders", () => {
    const { getByTestId } = render(
      <DeleteProgramDialog
        programName={""}
        disabled={false}
        onDelete={() => {}}
        onClose={() => {}}
      />
    );

    expect(getByTestId("delete-program-dialog")).toBeInTheDocument();
  });

  it("renders program name", () => {
    const programName = "Test program";
    const { getByTestId } = render(
      <DeleteProgramDialog
        programName={programName}
        disabled={false}
        onDelete={() => {}}
        onClose={() => {}}
      />
    );

    expect(getByTestId("delete-program-dialog")).toHaveTextContent(programName);
  });

  it("runs onClickDelete when delete button is clicked", () => {
    const onClickDelete = jest.fn();
    const { getByText } = render(
      <DeleteProgramDialog
        programName={""}
        disabled={false}
        onDelete={onClickDelete}
        onClose={() => {}}
      />
    );

    fireEvent.click(getByText("Delete"));

    expect(onClickDelete).toHaveBeenCalledTimes(1);
  });

  it("runs onClickCancel when cancel button is clicked", () => {
    const onClickCancel = jest.fn();
    const { getByText } = render(
      <DeleteProgramDialog
        programName={""}
        disabled={false}
        onDelete={() => {}}
        onClose={onClickCancel}
      />
    );

    fireEvent.click(getByText("Cancel"));

    expect(onClickCancel).toHaveBeenCalledTimes(1);
  });

  it("disables delete and cancel buttons when disabled is true", () => {
    const { getByText } = render(
      <DeleteProgramDialog
        programName={""}
        disabled={true}
        onDelete={() => {}}
        onClose={() => {}}
      />
    );

    expect(getByText("Delete")).toBeDisabled();
    expect(getByText("Cancel")).toBeDisabled();
  });
});

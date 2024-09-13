import { fireEvent, render } from "@testing-library/react";
import { OrgCreateSuccessDialog } from "./org-create-success-dialog";

describe("<OrgCreateSuccessDialog />", () => {
  it("renders", () => {
    const { getByTestId } = render(<OrgCreateSuccessDialog id={"1"} name={"New Org"} />);

    expect(getByTestId("org-create-success-dialog")).toBeInTheDocument();
  });

  it("renders provided org id and name", () => {
    const { getByText } = render(<OrgCreateSuccessDialog id={"999"} name={"New Org"} />);

    expect(getByText("New Org has been created!")).toBeInTheDocument();
    expect(getByText("Org ID:")).toBeInTheDocument();
    expect(getByText("999")).toBeInTheDocument();
  });

  it("runs onClickAccess if `Access organization` button is clicked", () => {
    const onClickAccess = jest.fn();
    const { getByText } = render(
      <OrgCreateSuccessDialog id={"1"} name={"New Org"} onClickAccess={onClickAccess} />
    );

    fireEvent.click(getByText("Access organization"));

    expect(onClickAccess).toHaveBeenCalled();
  });

  it("runs onClose if `Close Icon` is clicked", () => {
    const onClose = jest.fn();
    const { getByLabelText } = render(
      <OrgCreateSuccessDialog id={"1"} name={"New Org"} onClose={onClose} />
    );

    fireEvent.click(getByLabelText("close"));

    expect(onClose).toHaveBeenCalled();
  });
});

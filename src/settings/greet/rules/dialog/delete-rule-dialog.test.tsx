import { fireEvent, render } from "@testing-library/react";
import { DeleteRuleDialog } from "./delete-rule-dialog";

describe("<DeleteRuleDialog />", () => {
  it("renders", () => {
    const { getByTestId } = render(
      <DeleteRuleDialog
        ruleName={""}
        disabled={false}
        onDelete={() => {}}
        onClose={() => {}}
      />
    );

    expect(getByTestId("delete-rule-dialog")).toBeInTheDocument();
  });

  it("renders rule name", () => {
    const ruleName = "Test rule";
    const { getByTestId } = render(
      <DeleteRuleDialog
        ruleName={ruleName}
        disabled={false}
        onDelete={() => {}}
        onClose={() => {}}
      />
    );

    expect(getByTestId("delete-rule-dialog")).toHaveTextContent(ruleName);
  });

  it("runs onClickDelete when delete button is clicked", () => {
    const onClickDelete = jest.fn();
    const { getByText } = render(
      <DeleteRuleDialog
        ruleName={""}
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
      <DeleteRuleDialog
        ruleName={""}
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
      <DeleteRuleDialog
        ruleName={""}
        disabled={true}
        onDelete={() => {}}
        onClose={() => {}}
      />
    );

    expect(getByText("Delete")).toBeDisabled();
    expect(getByText("Cancel")).toBeDisabled();
  });
});

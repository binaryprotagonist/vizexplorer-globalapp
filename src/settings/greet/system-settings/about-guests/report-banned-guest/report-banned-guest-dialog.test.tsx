import { act, fireEvent, render, within } from "@testing-library/react";
import { ReportBannedGuestDialog } from "./report-banned-guest-dialog";
import { getInput, updateInput } from "testing/utils";
import { chipClasses } from "@mui/material";

describe("<ReportBannedGuestDialog />", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <ReportBannedGuestDialog emails={[]} onSave={() => {}} onClose={() => {}} />
    );

    expect(getByTestId("report-banned-guest-dialog")).toBeInTheDocument();
  });

  it("runs `onClose` if close button is clicked", () => {
    const onClose = jest.fn();
    const { getByLabelText } = render(
      <ReportBannedGuestDialog emails={[]} onSave={() => {}} onClose={onClose} />
    );

    fireEvent.click(getByLabelText("close"));

    expect(onClose).toHaveBeenCalled();
  });

  it("disables buttons and email field if `disabled` is true", () => {
    const { getByText, getByLabelText, getByTestId } = render(
      <ReportBannedGuestDialog
        emails={[]}
        onSave={() => {}}
        onClose={() => {}}
        disabled
      />
    );

    expect(getByText("Save")).toBeDisabled();
    expect(getByLabelText("close")).toBeDisabled();
    expect(getInput(getByTestId("email-input"))).toBeDisabled();
  });

  it("renders provided emails as chips", () => {
    const { getAllByTestId } = render(
      <ReportBannedGuestDialog
        emails={["test@test.com", "test2@test.com"]}
        onSave={() => {}}
        onClose={() => {}}
      />
    );

    const emailChips = getAllByTestId("email-chip");
    expect(emailChips).toHaveLength(2);
    expect(emailChips[0]).toHaveTextContent("test@test.com");
    expect(emailChips[1]).toHaveTextContent("test2@test.com");
  });

  it("can add additional email chips by filling the input and pressing Enter", () => {
    const { getByTestId, getAllByTestId } = render(
      <ReportBannedGuestDialog
        emails={["test@test.com", "test2@test.com"]}
        onSave={() => {}}
        onClose={() => {}}
      />
    );

    updateInput(getByTestId("email-input"), "test3@test.com");
    fireEvent.keyDown(getByTestId("email-input"), { key: "Enter" });

    const emailChips = getAllByTestId("email-chip");
    expect(emailChips).toHaveLength(3);
    expect(emailChips[2]).toHaveTextContent("test3@test.com");
  });

  it("can add additional email chips filling the input with a trailing space", () => {
    const { getByTestId, getAllByTestId } = render(
      <ReportBannedGuestDialog
        emails={["test@test.com", "test2@test.com"]}
        onSave={() => {}}
        onClose={() => {}}
      />
    );

    updateInput(getByTestId("email-input"), "test3@test.com ");

    const emailChips = getAllByTestId("email-chip");
    expect(emailChips).toHaveLength(3);
    expect(emailChips[2]).toHaveTextContent("test3@test.com");
  });

  it("doesn't add an email chip if no value is provided and the user presses Enter", () => {
    const { getByTestId, getAllByTestId } = render(
      <ReportBannedGuestDialog
        emails={["test@test.com", "test2@test.com"]}
        onSave={() => {}}
        onClose={() => {}}
      />
    );

    fireEvent.keyDown(getByTestId("email-input"), { key: "Enter" });
    expect(getAllByTestId("email-chip")).toHaveLength(2);
  });

  it("doesn't add an email chip if only Space is pressed", () => {
    const { getByTestId, getAllByTestId } = render(
      <ReportBannedGuestDialog
        emails={["test@test.com", "test2@test.com"]}
        onSave={() => {}}
        onClose={() => {}}
      />
    );

    updateInput(getByTestId("email-input"), " ");

    expect(getAllByTestId("email-chip")).toHaveLength(2);
    expect(getInput(getByTestId("email-input"))).toHaveValue("");
  });

  it("removes an email chip if the user clicks the remove icon", () => {
    const { getAllByTestId } = render(
      <ReportBannedGuestDialog
        emails={["test@test.com", "test2@test.com"]}
        onSave={() => {}}
        onClose={() => {}}
      />
    );

    let emailChips = getAllByTestId("email-chip");
    fireEvent.click(within(emailChips[0]).getByTestId("delete"));

    emailChips = getAllByTestId("email-chip");
    expect(emailChips).toHaveLength(1);
    expect(emailChips[0]).toHaveTextContent("test2@test.com");
  });

  it("doesn't allow removing chips using backspace", () => {
    const { getByTestId, getAllByTestId } = render(
      <ReportBannedGuestDialog
        emails={["test@test.com", "test2@test.com"]}
        onSave={() => {}}
        onClose={() => {}}
      />
    );

    fireEvent.keyDown(getInput(getByTestId("email-input"))!, { key: "Backspace" });
    expect(getAllByTestId("email-chip")).toHaveLength(2);
  });

  it("renders email chip as error state if the format is not valid email format", () => {
    const { getByTestId, getByRole } = render(
      <ReportBannedGuestDialog emails={["test"]} onSave={() => {}} onClose={() => {}} />
    );

    fireEvent.mouseOver(getByTestId("email-chip"));
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent("Invalid email address format");
    expect(getByTestId("email-chip")).toHaveClass(chipClasses.colorError);
  });

  it("renders chip in normal state if the format is valid email format", () => {
    const { getByTestId, queryByRole } = render(
      <ReportBannedGuestDialog
        emails={["test@test.com"]}
        onSave={() => {}}
        onClose={() => {}}
      />
    );

    fireEvent.mouseOver(getByTestId("email-chip"));
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(queryByRole("tooltip")).not.toBeInTheDocument();
    expect(getByTestId("email-chip")).toHaveClass(chipClasses.colorPrimary);
  });

  it("doesn't allow entering duplicate email addresses", () => {
    const { getByTestId, getAllByTestId, getByText } = render(
      <ReportBannedGuestDialog
        emails={["test@test.com"]}
        onSave={() => {}}
        onClose={() => {}}
      />
    );

    updateInput(getByTestId("email-input"), "test@test.com");
    fireEvent.keyDown(getByTestId("email-input"), { key: "Enter" });

    expect(
      getByText("Email duplicates not allowed", { exact: false })
    ).toBeInTheDocument();
    expect(getAllByTestId("email-chip")).toHaveLength(1);
  });

  it("runs `onSave` when Save is clicked", () => {
    const onSave = jest.fn();
    const { getByTestId, getByText } = render(
      <ReportBannedGuestDialog
        emails={["test@test.com"]}
        onSave={onSave}
        onClose={() => {}}
      />
    );

    updateInput(getByTestId("email-input"), "test2@test.com ");
    fireEvent.click(getByText("Save"));

    expect(onSave).toHaveBeenCalledWith(["test@test.com", "test2@test.com"]);
  });

  it("runs `onSave` if Save is clicked and there is a valid email input not converted to chip", () => {
    const onSave = jest.fn();
    const { getByTestId, getByText } = render(
      <ReportBannedGuestDialog emails={[]} onSave={onSave} onClose={() => {}} />
    );

    updateInput(getByTestId("email-input"), "test@test.com");
    fireEvent.click(getByText("Save"));

    expect(onSave).toHaveBeenCalledWith(["test@test.com"]);
  });

  it("displays error if Save is clicked with an invalid email input not converted to chip", () => {
    const onSave = jest.fn();
    const { getByTestId, getByText } = render(
      <ReportBannedGuestDialog emails={[]} onSave={onSave} onClose={() => {}} />
    );

    updateInput(getByTestId("email-input"), "notvalidemail");
    fireEvent.click(getByText("Save"));

    expect(onSave).not.toHaveBeenCalled();
    expect(getByText("not valid email format.", { exact: false })).toBeInTheDocument();
    expect(getByText("Save")).toBeDisabled();
  });
});

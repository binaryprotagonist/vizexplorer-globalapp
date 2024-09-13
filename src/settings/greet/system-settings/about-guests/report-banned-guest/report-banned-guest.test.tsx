import { act, fireEvent, render, within } from "@testing-library/react";
import { ReportBannedGuest } from "./report-banned-guest";
import { getInput } from "testing/utils";
import { ThemeProvider } from "../../../../../theme";

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("<ReportBannedGuest />", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <ReportBannedGuest
        config={null}
        onChange={() => {}}
        onClickEditEmails={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("report-banned-guest")).toBeInTheDocument();
  });

  it("renders expected title", () => {
    const { getByTestId } = render(
      <ReportBannedGuest
        config={null}
        onChange={() => {}}
        onClickEditEmails={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("report-banned-guest")).toHaveTextContent("Report banned guest");
  });

  it("renders expected help text", () => {
    const { getByTestId, getByRole } = render(
      <ReportBannedGuest
        config={null}
        onChange={() => {}}
        onClickEditEmails={() => {}}
      />,
      { wrapper }
    );

    fireEvent.mouseOver(getByTestId("help-tip"));

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(getByRole("tooltip")).toHaveTextContent(/Banned Guest/);
  });

  it("renders action toggle", () => {
    const { getByTestId } = render(
      <ReportBannedGuest
        config={{ enabled: false, emailRecipients: [] }}
        onChange={() => {}}
        onClickEditEmails={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("report-banned-action")).toBeInTheDocument();
  });

  it("doesn't render action toggle if `loading` is true", () => {
    const { queryByTestId } = render(
      <ReportBannedGuest
        config={{ enabled: false, emailRecipients: [] }}
        onChange={() => {}}
        onClickEditEmails={() => {}}
        loading
      />,
      { wrapper }
    );

    expect(queryByTestId("report-banned-action")).not.toBeInTheDocument();
  });

  it("renders email list if `config.enabled` is true", () => {
    const { getByTestId } = render(
      <ReportBannedGuest
        config={{ enabled: true, emailRecipients: ["test@test.com"] }}
        onChange={() => {}}
        onClickEditEmails={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("email-list")).toBeInTheDocument();
    expect(getByTestId("email-list")).toHaveTextContent("test@test.com");
  });

  it("renders edit email list button if `config.enabled` is true", () => {
    const { getByTestId } = render(
      <ReportBannedGuest
        config={{ enabled: true, emailRecipients: ["test@test.com"] }}
        onChange={() => {}}
        onClickEditEmails={() => {}}
      />,
      { wrapper }
    );

    expect(within(getByTestId("email-list")).getByTestId("edit")).toBeInTheDocument();
  });

  it("runs `onClickEditEmails` when edit email list button is clicked", () => {
    const onClickEditEmails = jest.fn();
    const { getByTestId } = render(
      <ReportBannedGuest
        config={{ enabled: true, emailRecipients: ["test@test.com"] }}
        onChange={() => {}}
        onClickEditEmails={onClickEditEmails}
      />,
      { wrapper }
    );

    fireEvent.click(within(getByTestId("email-list")).getByTestId("edit"));

    expect(onClickEditEmails).toHaveBeenCalledTimes(1);
  });

  it("doesn't render email list if `config.enabled` is false", () => {
    const { queryByTestId } = render(
      <ReportBannedGuest
        config={{ enabled: false, emailRecipients: ["test@test.com"] }}
        onChange={() => {}}
        onClickEditEmails={() => {}}
      />,
      { wrapper }
    );

    expect(queryByTestId("email-list")).not.toBeInTheDocument();
  });

  it("renders action menu if the action toggle is clicked", () => {
    const { getByTestId } = render(
      <ReportBannedGuest
        config={{ enabled: false, emailRecipients: [] }}
        onChange={() => {}}
        onClickEditEmails={() => {}}
      />,
      { wrapper }
    );

    fireEvent.click(getByTestId("report-banned-action"));

    expect(getByTestId("report-banned-action-menu")).toBeInTheDocument();
  });

  it("renders expected action menu options", () => {
    const { getByTestId, getAllByRole } = render(
      <ReportBannedGuest
        config={{ enabled: false, emailRecipients: [] }}
        onChange={() => {}}
        onClickEditEmails={() => {}}
      />,
      { wrapper }
    );

    fireEvent.click(getByTestId("report-banned-action"));

    const menuOptions = getAllByRole("option");
    expect(menuOptions[0]).toHaveTextContent("Yes");
    expect(menuOptions[1]).toHaveTextContent("No");
  });

  it("selects menu option `Yes` if `config.enabled` is true", () => {
    const { getByTestId, getAllByRole } = render(
      <ReportBannedGuest
        config={{ enabled: true, emailRecipients: [] }}
        onChange={() => {}}
        onClickEditEmails={() => {}}
      />,
      { wrapper }
    );

    fireEvent.click(getByTestId("report-banned-action"));

    const [yesEle, noEle] = getAllByRole("option");
    expect(getInput(yesEle)).toBeChecked();
    expect(getInput(noEle)).not.toBeChecked();
  });

  it("selects menu option `No` if `config.enabled` is false", () => {
    const { getByTestId, getAllByRole } = render(
      <ReportBannedGuest
        config={{ enabled: false, emailRecipients: [] }}
        onChange={() => {}}
        onClickEditEmails={() => {}}
      />,
      { wrapper }
    );

    fireEvent.click(getByTestId("report-banned-action"));

    const [yesEle, noEle] = getAllByRole("option");
    expect(getInput(yesEle)).not.toBeChecked();
    expect(getInput(noEle)).toBeChecked();
  });

  it("runs `onChange` with expected value when action menu option is clicked", () => {
    const onChange = jest.fn();
    const { getByTestId, getAllByRole } = render(
      <ReportBannedGuest
        config={{ enabled: false, emailRecipients: ["test@test.com"] }}
        onChange={onChange}
        onClickEditEmails={() => {}}
      />,
      { wrapper }
    );

    fireEvent.click(getByTestId("report-banned-action"));
    fireEvent.click(getAllByRole("option")[0]);

    expect(onChange).toHaveBeenCalledWith({
      settingId: "report-banned-guest",
      value: { enabled: true, emailRecipients: ["test@test.com"] }
    });
  });
});

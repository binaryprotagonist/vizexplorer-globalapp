import { fireEvent, render, within } from "@testing-library/react";
import { AboutGuests } from "./about-guests";
import { produce } from "immer";
import { AboutGuestsActionEvt, AboutGuestsChangeParams } from "./types";
import { mockGreetSettings } from "testing/mocks";

const mockSettingData = produce(mockGreetSettings, (draft) => {
  draft.guestReportBanned.enabled = true;
  draft.guestReportBanned.emailRecipients = ["test@test.com"];
});

describe("<AboutGuests />", () => {
  it("renders", () => {
    const { getByTestId } = render(
      <AboutGuests
        settingIds={[]}
        settingData={null}
        onActionClick={() => {}}
        onChange={() => {}}
      />
    );

    expect(getByTestId("about-guests")).toBeInTheDocument();
  });

  it("renders ReportBannedGuest if settingIds contains report-banned-guest", () => {
    const { getByTestId } = render(
      <AboutGuests
        settingIds={["report-banned-guest"]}
        settingData={null}
        onActionClick={() => {}}
        onChange={() => {}}
      />
    );

    expect(getByTestId("report-banned-guest")).toBeInTheDocument();
  });

  it("doesn't render ReportBannedGuest if settingIds doesn't contain report-banned-guest", () => {
    const { queryByTestId } = render(
      <AboutGuests
        settingIds={[]}
        settingData={null}
        onActionClick={() => {}}
        onChange={() => {}}
      />
    );

    expect(queryByTestId("report-banned-guest")).not.toBeInTheDocument();
  });

  describe("ReportBannedGuest", () => {
    it("renders action and email list if enabled", () => {
      const { getByTestId } = render(
        <AboutGuests
          settingIds={["report-banned-guest"]}
          settingData={mockSettingData}
          onActionClick={() => {}}
          onChange={() => {}}
        />
      );

      expect(getByTestId("report-banned-action")).toHaveTextContent("Yes");
      expect(getByTestId("email-list")).toHaveTextContent("test@test.com");
    });

    it("doesn't render the action or email list if `loading` is true", () => {
      const { queryByTestId } = render(
        <AboutGuests
          loading
          settingIds={["report-banned-guest"]}
          settingData={mockSettingData}
          onActionClick={() => {}}
          onChange={() => {}}
        />
      );

      expect(queryByTestId("report-banned-action")).not.toBeInTheDocument();
      expect(queryByTestId("email-list")).not.toBeInTheDocument();
    });

    it("renders only the action button if disabled", () => {
      const disabledReportBanned = produce(mockSettingData, (draft) => {
        draft.guestReportBanned.enabled = false;
      });
      const { getByTestId, queryByTestId } = render(
        <AboutGuests
          settingIds={["report-banned-guest"]}
          settingData={disabledReportBanned}
          onActionClick={() => {}}
          onChange={() => {}}
        />
      );

      expect(getByTestId("report-banned-action")).toHaveTextContent("No");
      expect(queryByTestId("email-list")).not.toBeInTheDocument();
    });

    it("runs `onChange` if the action value is changed", () => {
      const onChange = jest.fn();
      const { getByTestId, getByText } = render(
        <AboutGuests
          settingIds={["report-banned-guest"]}
          settingData={mockSettingData}
          onActionClick={() => {}}
          onChange={onChange}
        />
      );

      fireEvent.click(getByTestId("report-banned-action"));
      fireEvent.click(getByText("No"));

      const emailRecipients = mockSettingData.guestReportBanned.emailRecipients;
      expect(onChange).toHaveBeenCalledWith<[AboutGuestsChangeParams]>({
        settingId: "report-banned-guest",
        value: { enabled: false, emailRecipients }
      });
    });

    it("runs `onActionClick` if the edit email list button is clicked", () => {
      const onActionClick = jest.fn();
      const { getByTestId } = render(
        <AboutGuests
          settingIds={["report-banned-guest"]}
          settingData={mockSettingData}
          onActionClick={onActionClick}
          onChange={() => {}}
        />
      );

      fireEvent.click(within(getByTestId("email-list")).getByTestId("edit"));

      expect(onActionClick).toHaveBeenCalledWith<[AboutGuestsActionEvt]>(
        "edit-report-banned-guest-email"
      );
    });
  });
});

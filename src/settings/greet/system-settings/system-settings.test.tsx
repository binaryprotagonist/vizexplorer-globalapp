import { fireEvent, render, within } from "@testing-library/react";
import { SystemSettings } from "./system-settings";
import { AlertProvider } from "view-v2/alert";
import { MockedProvider } from "testing/graphql-provider";
import {
  mockGreetSettings,
  mockGreetSettingsQuery,
  MockGreetSettingsQueryOpts,
  mockGreetSettingsUpdate,
  MockGreetSettingsUpdateOpts
} from "testing/mocks";
import { produce } from "immer";
import { getInput, updateInput } from "testing/utils";
import { GraphQLError } from "graphql";

describe("<SystemSettings />", () => {
  let mockSettingsRequests: MockGreetSettingsQueryOpts[];
  let mockSettingsUpdateOpts: MockGreetSettingsUpdateOpts;

  beforeEach(() => {
    mockSettingsRequests = [{ settings: mockGreetSettings }];
    mockSettingsUpdateOpts = {
      input: {},
      settings: mockGreetSettings
    };
  });

  function wrapper({ children }: { children?: React.ReactNode }) {
    return (
      <AlertProvider>
        <MockedProvider
          mocks={[
            ...mockSettingsRequests.map(mockGreetSettingsQuery),
            mockGreetSettingsUpdate(mockSettingsUpdateOpts)
          ]}
        >
          {children}
        </MockedProvider>
      </AlertProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(<SystemSettings />, { wrapper });

    expect(getByTestId("system-settings")).toBeInTheDocument();
  });

  it("renders About Guests category", () => {
    const { getByTestId } = render(<SystemSettings />, { wrapper });

    expect(getByTestId("about-guests")).toBeInTheDocument();
    expect(getByTestId("about-guests")).toHaveTextContent("ABOUT GUESTS");
  });

  it("renders expected settings within About Guests category", () => {
    const { getByTestId } = render(<SystemSettings />, { wrapper });

    const aboutGuests = getByTestId("about-guests");
    expect(within(aboutGuests).getByTestId("report-banned-guest")).toBeInTheDocument();
  });

  it("renders expected settings within About Greets category", () => {
    const { getByTestId } = render(<SystemSettings />, { wrapper });

    const aboutGreets = getByTestId("about-greets");
    expect(
      within(aboutGreets).getByTestId("assign-by-priority-score")
    ).toBeInTheDocument();
    expect(
      within(aboutGreets).getByTestId("suppression-days-after-completion")
    ).toBeInTheDocument();
    expect(
      within(aboutGreets).getByTestId("queue-inactive-greet-timeout")
    ).toBeInTheDocument();
    expect(
      within(aboutGreets).getByTestId("greet-reassignment-timeout")
    ).toBeInTheDocument();
    expect(
      within(aboutGreets).getByTestId("show-guests-active-actions")
    ).toBeInTheDocument();
  });

  it("renders expected settings within About Hosts category", () => {
    const { getByTestId } = render(<SystemSettings />, { wrapper });

    const aboutGreets = getByTestId("about-hosts");
    expect(
      within(aboutGreets).getByTestId("enable-section-for-greet")
    ).toBeInTheDocument();
    expect(
      within(aboutGreets).getByTestId("allow-suppression-without-completion")
    ).toBeInTheDocument();
    expect(
      within(aboutGreets).getByTestId("max-assignment-per-host")
    ).toBeInTheDocument();
    expect(within(aboutGreets).getByTestId("max-missed-greets")).toBeInTheDocument();
  });

  it("renders No Search Results component if there are no system settings matching the search", async () => {
    const { getByTestId, findAllByTestId } = render(<SystemSettings />, { wrapper });

    await findAllByTestId("system-settings");
    updateInput(getByTestId("system-setting-search"), "zzzzz");
    expect(getByTestId("no-search-results")).toBeInTheDocument();
  });

  it("can search on system settings", async () => {
    const { getByTestId, findAllByTestId, queryByTestId } = render(<SystemSettings />, {
      wrapper
    });

    await findAllByTestId("system-settings");

    const settingName = "report banned";
    updateInput(getByTestId("system-setting-search"), settingName);

    expect(getInput(getByTestId("system-setting-search"))).toHaveValue(settingName);
    expect(getByTestId("about-guests")).toBeInTheDocument();
    expect(queryByTestId("about-hosts")).not.toBeInTheDocument();
  });

  it("renders error content if greet settings API returns an error", async () => {
    mockSettingsRequests[0].errors = [new GraphQLError("Error")];
    const { findByTestId } = render(<SystemSettings />, { wrapper });

    await findByTestId("something-went-wrong");
  });

  it("can recover from an API error by clicking refresh on the error content", async () => {
    mockSettingsRequests[0].errors = [new GraphQLError("Error")]; // firt request fails
    mockSettingsRequests.push({ settings: mockGreetSettings }); // second request succeeds
    const { findByTestId } = render(<SystemSettings />, { wrapper });

    const errorContent = await findByTestId("something-went-wrong");
    fireEvent.click(within(errorContent).getByText("Refresh page"));

    const reportBannedBtn = await findByTestId("report-banned-action");
    expect(reportBannedBtn).toHaveTextContent("No");
  });

  describe("ReportBannedGuest", () => {
    it("can update value from `Yes` to `No`", async () => {
      mockSettingsRequests[0].settings = produce(mockGreetSettings, (draft) => {
        draft.guestReportBanned.enabled = true;
        draft.guestReportBanned.emailRecipients = ["test@test.com"];
      });
      mockSettingsUpdateOpts.input = {
        guestReportBanned: {
          enabled: false,
          emailRecipients: ["test@test.com"]
        }
      };
      const { getByTestId, findByTestId } = render(<SystemSettings />, {
        wrapper
      });

      const reportBannedAction = await findByTestId("report-banned-action");
      fireEvent.click(reportBannedAction);
      fireEvent.click(within(getByTestId("report-banned-action-menu")).getByText("No"));

      const alert = await findByTestId("alert");
      expect(getByTestId("report-banned-action")).toHaveTextContent("No");
      expect(alert).toHaveTextContent("Setting change saved");
    });

    it("can update value from `No` to `Yes`", async () => {
      mockSettingsRequests[0].settings = produce(mockGreetSettings, (draft) => {
        draft.guestReportBanned.enabled = false;
        draft.guestReportBanned.emailRecipients = ["test@test.com"];
      });
      mockSettingsUpdateOpts.input = {
        guestReportBanned: {
          enabled: true,
          emailRecipients: ["test@test.com"]
        }
      };
      const { getByTestId, findByTestId } = render(<SystemSettings />, { wrapper });

      const reportBannedAction = await findByTestId("report-banned-action");
      fireEvent.click(reportBannedAction);
      fireEvent.click(within(getByTestId("report-banned-action-menu")).getByText("Yes"));
      fireEvent.click(
        within(getByTestId("report-banned-guest-dialog")).getByText("Save")
      );

      const alert = await findByTestId("alert");
      expect(getByTestId("report-banned-action")).toHaveTextContent("Yes");
      expect(getByTestId("email-list")).toHaveTextContent("test@test.com");
      expect(alert).toHaveTextContent("Setting change saved");
    });

    it("can update the email list", async () => {
      mockSettingsRequests[0].settings = produce(mockGreetSettings, (draft) => {
        draft.guestReportBanned.enabled = true;
        draft.guestReportBanned.emailRecipients = ["test@test.com"];
      });
      mockSettingsUpdateOpts.input = {
        guestReportBanned: {
          enabled: true,
          emailRecipients: ["test@test.com", "test2@test.com"]
        }
      };
      const { findByTestId, getByTestId } = render(<SystemSettings />, { wrapper });

      const emailList = await findByTestId("email-list");
      fireEvent.click(within(emailList).getByTestId("edit"));

      const dialog = getByTestId("report-banned-guest-dialog");
      updateInput(within(dialog).getByTestId("email-input"), "test2@test.com ");
      fireEvent.click(within(dialog).getByText("Save"));

      const alert = await findByTestId("alert");
      expect(getByTestId("report-banned-action")).toHaveTextContent("Yes");
      expect(getByTestId("email-list")).toHaveTextContent("test@test.com");
      expect(getByTestId("email-list")).toHaveTextContent("test2@test.com");
      expect(alert).toHaveTextContent("Setting change saved");
    });
  });

  describe("SuppressionDaysAfterCompletion", () => {
    it("can update coded suppression days", async () => {
      mockSettingsUpdateOpts.input = {
        greetSuppressionDays: {
          coded: 2,
          uncoded: mockGreetSettings.greetSuppressionDays.uncoded
        }
      };
      const { findByTestId, getByTestId } = render(<SystemSettings />, { wrapper });

      const codedBtn = await findByTestId("coded-suppression-days-action");
      fireEvent.click(codedBtn);
      const codedMenu = getByTestId("coded-suppression-days-menu");
      fireEvent.click(within(codedMenu).getByText("2 days"));

      const alert = await findByTestId("alert");
      expect(getByTestId("coded-suppression-days-action")).toHaveTextContent("2 days");
      expect(alert).toHaveTextContent("Setting change saved");
    });

    it("can update uncoded suppression days", async () => {
      mockSettingsUpdateOpts.input = {
        greetSuppressionDays: {
          coded: mockGreetSettings.greetSuppressionDays.coded,
          uncoded: 3
        }
      };
      const { findByTestId, getByTestId } = render(<SystemSettings />, { wrapper });

      const uncodedBtn = await findByTestId("uncoded-suppression-days-action");
      fireEvent.click(uncodedBtn);
      const codedMenu = getByTestId("uncoded-suppression-days-menu");
      fireEvent.click(within(codedMenu).getByText("3 days"));

      const alert = await findByTestId("alert");
      expect(getByTestId("uncoded-suppression-days-action")).toHaveTextContent("3 days");
      expect(alert).toHaveTextContent("Setting change saved");
    });
  });

  describe("QueueInactiveGreetTimeout", () => {
    it("can update greet timeout", async () => {
      mockSettingsUpdateOpts.input = {
        greetQueueInactiveTimeout: {
          hours: 1,
          minutes: 30
        }
      };
      const { findByTestId, getByTestId } = render(<SystemSettings />, { wrapper });

      const action = await findByTestId("queue-inactive-timeout-action");
      fireEvent.click(action);
      const codedMenu = getByTestId("queue-inactive-timeout-menu");
      fireEvent.click(within(codedMenu).getByText("1h 30min"));

      const alert = await findByTestId("alert");
      expect(getByTestId("queue-inactive-timeout-action")).toHaveTextContent("1h 30min");
      expect(alert).toHaveTextContent("Setting change saved");
    });
  });

  describe("GreetReassignmentTimeout", () => {
    it("can update greet timeout", async () => {
      mockSettingsUpdateOpts.input = {
        greetReassignmentTimeout: {
          hours: 0,
          minutes: 15
        }
      };
      const { findByTestId, getByTestId } = render(<SystemSettings />, { wrapper });

      const action = await findByTestId("reassignment-timeout-action");
      fireEvent.click(action);
      const codedMenu = getByTestId("reassignment-timeout-menu");
      fireEvent.click(within(codedMenu).getByText("15 minutes"));

      const alert = await findByTestId("alert");
      expect(getByTestId("reassignment-timeout-action")).toHaveTextContent("15 minutes");
      expect(alert).toHaveTextContent("Setting change saved");
    });
  });

  describe("MaxAssignmentsPerHost", () => {
    it("can update number of assignments", async () => {
      mockSettingsUpdateOpts.input = { hostMaxAssignments: 2 };
      const { findByTestId, getByTestId } = render(<SystemSettings />, { wrapper });

      const action = await findByTestId("max-assignments-per-host-action");
      fireEvent.click(action);
      const assignmentMenu = getByTestId("max-assignments-per-host-menu");
      fireEvent.click(within(assignmentMenu).getByText("2 greets"));

      const alert = await findByTestId("alert");
      expect(getByTestId("max-assignments-per-host-action")).toHaveTextContent(
        "2 greets"
      );
      expect(alert).toHaveTextContent("Setting change saved");
    });
  });

  describe("MaxMissedGreets", () => {
    it("can update number of max greets", async () => {
      mockSettingsUpdateOpts.input = { hostMaxMissedGreets: 2 };
      const { findByTestId, getByTestId } = render(<SystemSettings />, { wrapper });

      const action = await findByTestId("max-missed-greets-action");
      fireEvent.click(action);
      const assignmentMenu = getByTestId("max-missed-greets-menu");
      fireEvent.click(within(assignmentMenu).getByText("2 greets"));

      const alert = await findByTestId("alert");
      expect(getByTestId("max-missed-greets-action")).toHaveTextContent("2 greets");
      expect(alert).toHaveTextContent("Setting change saved");
    });
  });
});

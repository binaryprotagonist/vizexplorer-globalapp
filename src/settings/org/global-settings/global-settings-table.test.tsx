import { fireEvent, render } from "@testing-library/react";
import { GlobalSettingsTable } from "./global-settings-table";
import {
  defaultGlobalSettings,
  defaultGuestTimePeriodsSetting,
  defaultHostTimePeriodsSetting,
  defaultWorthPctSetting,
  GlobalSetting,
  GuestTimePeriodsSetting,
  HostTimePeriodsSetting
} from "./types";
import { mockAdmin, mockOrgAdmin, mockViewer } from "../../../view/testing/mocks";
import { ThemeProvider } from "../../../theme";
import { act } from "react-dom/test-utils";
import { timePeriodLabel } from "./utils";
import { produce } from "immer";
import { mockTimePeriods } from "./__mocks__/global-settings";

const mockOnEditClick = jest.fn();

describe("<GlobalSettingsTable />", () => {
  let mockGlobalSettings: GlobalSetting[] = [];

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    mockGlobalSettings = [...defaultGlobalSettings];
    mockOnEditClick.mockReset();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  function wrapper({ children }: any) {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  it("renders", () => {
    const { getByTestId } = render(
      <GlobalSettingsTable
        currentUser={mockOrgAdmin}
        settings={mockGlobalSettings}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    expect(getByTestId("global-settings-table")).toBeInTheDocument();
  });

  it("renders expected columns", () => {
    const { getByText } = render(
      <GlobalSettingsTable
        currentUser={mockOrgAdmin}
        settings={mockGlobalSettings}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    expect(getByText("Setting Name")).toBeInTheDocument();
    expect(getByText("Description")).toBeInTheDocument();
    expect(getByText("Value")).toBeInTheDocument();
  });

  it("renders expected Name and Desciptions", () => {
    const { getAllByTestId } = render(
      <GlobalSettingsTable
        currentUser={mockOrgAdmin}
        settings={mockGlobalSettings}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    const rows = getAllByTestId("global-settings-row");
    // assume setting order is the same as the rows order
    mockGlobalSettings.forEach((setting, idx) => {
      expect(rows[idx]).toHaveTextContent(setting.name);
      expect(rows[idx]).toHaveTextContent(setting.description);
    });
  });

  it("renders expected value for worth-pct setting", () => {
    const { getByTestId } = render(
      <GlobalSettingsTable
        currentUser={mockOrgAdmin}
        settings={[defaultWorthPctSetting]}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );
    const worthPtcRow = getByTestId("global-settings-row");
    expect(worthPtcRow).toHaveTextContent("40%");
  });

  it("renders expected value for guest-time-periods setting", () => {
    const mixedTimePeriods = produce(mockTimePeriods, (draft) => {
      return draft.map((p, idx) => ({
        ...p,
        enabled: idx % 2 === 0,
        default: idx === 2
      }));
    });
    const mockGuestTimePeriodSetting: GuestTimePeriodsSetting = {
      ...defaultGuestTimePeriodsSetting,
      config: { value: mixedTimePeriods }
    };
    const { getByTestId } = render(
      <GlobalSettingsTable
        currentUser={mockOrgAdmin}
        settings={[mockGuestTimePeriodSetting]}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    const timePeriodRow = getByTestId("global-settings-row");
    mixedTimePeriods.forEach((p) => {
      if (!p.enabled) {
        expect(timePeriodRow).not.toHaveTextContent(timePeriodLabel(p));
        return;
      }

      const label = timePeriodLabel(p);
      const value = p.default ? `${label} (default)` : label;
      expect(timePeriodRow).toHaveTextContent(value);
    });
  });

  it("renders expected value for host-time-periods setting", () => {
    const mixedTimePeriods = produce(mockTimePeriods, (draft) => {
      return draft.map((p, idx) => ({
        ...p,
        enabled: idx % 2 === 0,
        default: idx === 2
      }));
    });
    const mockHostTimePeriodSetting: HostTimePeriodsSetting = {
      ...defaultHostTimePeriodsSetting,
      config: { value: mixedTimePeriods }
    };
    const { getByTestId } = render(
      <GlobalSettingsTable
        currentUser={mockOrgAdmin}
        settings={[mockHostTimePeriodSetting]}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    const timePeriodRow = getByTestId("global-settings-row");
    mixedTimePeriods.forEach((p) => {
      if (!p.enabled) {
        expect(timePeriodRow).not.toHaveTextContent(timePeriodLabel(p));
        return;
      }

      const label = timePeriodLabel(p);
      const value = p.default ? `${label} (default)` : label;
      expect(timePeriodRow).toHaveTextContent(value);
    });
  });

  it("can sort by Setting Name", () => {
    const { getByText, getAllByTestId } = render(
      <GlobalSettingsTable
        currentUser={mockOrgAdmin}
        settings={mockGlobalSettings}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Setting Name"));
    const rows = getAllByTestId("global-settings-row");
    expect(rows[0]).toHaveTextContent("Guest Summary Time Period");
    expect(rows[1]).toHaveTextContent("Host Summary Time Period");
    expect(rows[2]).toHaveTextContent("Worth Percent");
  });

  it("can filter by Setting Name", () => {
    const { getAllByTestId, getByPlaceholderText } = render(
      <GlobalSettingsTable
        currentUser={mockOrgAdmin}
        settings={mockGlobalSettings}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    act(() => {
      const search = getByPlaceholderText("Search");
      fireEvent.change(search, {
        target: { value: mockGlobalSettings[0].name }
      });
      jest.runAllTimers();
    });
    const rows = getAllByTestId("global-settings-row");
    expect(rows).toHaveLength(1);
  });

  it("can filter by Description", () => {
    const { getAllByTestId, getByPlaceholderText } = render(
      <GlobalSettingsTable
        currentUser={mockOrgAdmin}
        settings={mockGlobalSettings}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    act(() => {
      const search = getByPlaceholderText("Search");
      fireEvent.change(search, {
        target: { value: mockGlobalSettings[0].description }
      });
      jest.runAllTimers();
    });
    const rows = getAllByTestId("global-settings-row");
    expect(rows).toHaveLength(1);
  });

  it("can filter by Value", () => {
    const { getAllByTestId, getByPlaceholderText } = render(
      <GlobalSettingsTable
        currentUser={mockOrgAdmin}
        settings={mockGlobalSettings}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    act(() => {
      const search = getByPlaceholderText("Search");
      fireEvent.change(search, {
        target: { value: mockGlobalSettings[0].config.value }
      });
      jest.runAllTimers();
    });
    const rows = getAllByTestId("global-settings-row");
    expect(rows).toHaveLength(1);
  });

  it("renders HelpTip if Setting has `additionalInfo`", () => {
    const { getByTestId } = render(
      <GlobalSettingsTable
        currentUser={mockOrgAdmin}
        settings={[defaultWorthPctSetting]}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    expect(getByTestId("setting-help")).toBeInTheDocument();
  });

  it("doesn't render HelpTip if Setting doesn't have `additionalInfo`", () => {
    const noAdditionalInfo = produce(defaultWorthPctSetting, (draft) => {
      delete draft.additionalInfo;
    });
    const { queryByTestId } = render(
      <GlobalSettingsTable
        currentUser={mockOrgAdmin}
        settings={[noAdditionalInfo]}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    expect(queryByTestId("setting-help")).not.toBeInTheDocument();
  });

  it("renders `LoadingTable` if loading is true", () => {
    const { getByTestId, queryByTestId } = render(
      <GlobalSettingsTable
        currentUser={mockOrgAdmin}
        settings={mockGlobalSettings}
        loading={true}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    expect(getByTestId("global-settings-loading")).toBeInTheDocument();
    expect(queryByTestId("global-settings-table")).not.toBeInTheDocument();
  });

  it("doesnt render `LoadingTable` if loading is false", () => {
    const { getByTestId, queryByTestId } = render(
      <GlobalSettingsTable
        currentUser={mockOrgAdmin}
        settings={mockGlobalSettings}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    expect(getByTestId("global-settings-table")).toBeInTheDocument();
    expect(queryByTestId("global-settings-loading")).not.toBeInTheDocument();
  });

  it("enables `Edit` for OrgAdmin", () => {
    const { getAllByText } = render(
      <GlobalSettingsTable
        currentUser={mockOrgAdmin}
        settings={mockGlobalSettings}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    const edits = getAllByText("Edit");
    expect(edits).toHaveLength(mockGlobalSettings.length);
    edits.forEach((edit) => {
      expect(edit).toBeEnabled();
    });
  });

  it("disables `Edit` for Admin", () => {
    const { getAllByText } = render(
      <GlobalSettingsTable
        currentUser={mockAdmin}
        settings={mockGlobalSettings}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    const edits = getAllByText("Edit");
    expect(edits).toHaveLength(mockGlobalSettings.length);
    edits.forEach((edit) => {
      expect(edit).toBeDisabled();
    });
  });

  it("disables `Edit` for Viewer", () => {
    const { getAllByText } = render(
      <GlobalSettingsTable
        currentUser={mockViewer}
        settings={mockGlobalSettings}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    const edits = getAllByText("Edit");
    expect(edits).toHaveLength(mockGlobalSettings.length);
    edits.forEach((edit) => {
      expect(edit).toBeDisabled();
    });
  });

  it("renders tooltip for `Edit` if disabled", () => {
    const { getAllByText, getByRole } = render(
      <GlobalSettingsTable
        currentUser={mockViewer}
        settings={mockGlobalSettings}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    const edits = getAllByText("Edit");
    act(() => {
      fireEvent.mouseOver(edits[0]);
      jest.runAllTimers();
    });
    expect(getByRole("tooltip")).toBeInTheDocument();
  });

  it("doesn't render tooltip for `Edit` if enabled", () => {
    const { getAllByText, queryByRole } = render(
      <GlobalSettingsTable
        currentUser={mockOrgAdmin}
        settings={mockGlobalSettings}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    const edits = getAllByText("Edit");
    act(() => {
      fireEvent.mouseOver(edits[0]);
      jest.runAllTimers();
    });
    expect(queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("runs `onEditClick` when `Edit` is clicked", () => {
    const { getAllByText } = render(
      <GlobalSettingsTable
        currentUser={mockOrgAdmin}
        settings={mockGlobalSettings}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    // assume row order matches mockGlobalSettings
    fireEvent.click(getAllByText("Edit")[0]);
    expect(mockOnEditClick.mock.calls[0][0].id).toEqual(mockGlobalSettings[0].id);
  });
});

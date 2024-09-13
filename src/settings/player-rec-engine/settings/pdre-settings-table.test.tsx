import { fireEvent, render } from "@testing-library/react";
import {
  defaultPdreSettings,
  defaultTaskFetchLimit,
  defaultValueMetric,
  PdreSetting
} from "./types";
import { mockAdmin, mockOrgAdmin, mockViewer } from "../../../view/testing/mocks";
import { ThemeProvider } from "../../../theme";
import { act } from "react-dom/test-utils";
import { displaySettingValue } from "./utils";
import { PdreSettingsTable } from "./pdre-settings-table";
import { produce } from "immer";

const mockOnEditClick = jest.fn();

describe("<PdreSettingsTable />", () => {
  let mockPdreSettings: PdreSetting[] = [];

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    mockPdreSettings = [...defaultPdreSettings];
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
      <PdreSettingsTable
        currentUser={mockOrgAdmin}
        settings={mockPdreSettings}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    expect(getByTestId("pdre-settings-table")).toBeInTheDocument();
  });

  it("renders expected columns", () => {
    const { getByText } = render(
      <PdreSettingsTable
        currentUser={mockOrgAdmin}
        settings={mockPdreSettings}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    expect(getByText("Setting Name")).toBeInTheDocument();
    expect(getByText("Description")).toBeInTheDocument();
    expect(getByText("Value")).toBeInTheDocument();
  });

  it("renders expected row values", () => {
    const { getAllByTestId } = render(
      <PdreSettingsTable
        currentUser={mockOrgAdmin}
        settings={mockPdreSettings}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    const rows = getAllByTestId("pdre-settings-row");
    // assume setting order is the same as the rows order
    mockPdreSettings.forEach((setting, idx) => {
      expect(rows[idx]).toHaveTextContent(setting.name);
      expect(rows[idx]).toHaveTextContent(setting.description);
      expect(rows[idx]).toHaveTextContent(displaySettingValue(setting));
    });
  });

  it("can sort by Setting Name", () => {
    // focus on the order position of only 2 settings
    const mixedOrderByName = produce(mockPdreSettings, (draft) => {
      draft[1].name = "1 setting name";
      draft[3].name = "2 setting name";
    });
    const { getByText, getAllByTestId } = render(
      <PdreSettingsTable
        currentUser={mockOrgAdmin}
        settings={mixedOrderByName}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    // validate ascending
    fireEvent.click(getByText("Setting Name"));
    let rows = getAllByTestId("pdre-settings-row");

    // prepared mock names should be the first two
    expect(rows[0]).toHaveTextContent(mixedOrderByName[1].name);
    expect(rows[1]).toHaveTextContent(mixedOrderByName[3].name);

    // validate descending
    fireEvent.click(getByText("Setting Name"));
    rows = getAllByTestId("pdre-settings-row");
    // prepared mock names should be the last two
    expect(rows[rows.length - 1]).toHaveTextContent(mixedOrderByName[1].name);
    expect(rows[rows.length - 2]).toHaveTextContent(mixedOrderByName[3].name);
  });

  it("can filter by Setting Name", () => {
    const { getAllByTestId, getByPlaceholderText } = render(
      <PdreSettingsTable
        currentUser={mockOrgAdmin}
        settings={mockPdreSettings}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    act(() => {
      const search = getByPlaceholderText("Search");
      fireEvent.change(search, { target: { value: mockPdreSettings[0].name } });
      jest.runAllTimers();
    });

    const rows = getAllByTestId("pdre-settings-row");
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent(mockPdreSettings[0].name);
  });

  it("can filter by Description", () => {
    const { getAllByTestId, getByPlaceholderText } = render(
      <PdreSettingsTable
        currentUser={mockOrgAdmin}
        settings={mockPdreSettings}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    const search = getByPlaceholderText("Search");
    fireEvent.change(search, {
      target: { value: mockPdreSettings[0].description }
    });
    act(() => {
      jest.runAllTimers();
    });

    const rows = getAllByTestId("pdre-settings-row");
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent(mockPdreSettings[0].description);
  });

  it("can filter by Value", () => {
    const { getAllByTestId, getByPlaceholderText } = render(
      <PdreSettingsTable
        currentUser={mockOrgAdmin}
        settings={mockPdreSettings}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    const value = displaySettingValue(mockPdreSettings[0]);
    act(() => {
      const search = getByPlaceholderText("Search");
      fireEvent.change(search, {
        target: { value }
      });
      jest.runAllTimers();
    });

    const rows = getAllByTestId("pdre-settings-row");
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent(value);
  });

  it("renders HelpTip if Setting has `additionalInfo`", () => {
    const { getByTestId } = render(
      <PdreSettingsTable
        currentUser={mockOrgAdmin}
        settings={[defaultValueMetric]}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    expect(getByTestId("setting-help")).toBeInTheDocument();
  });

  it("doesn't render HelpTip if Setting doesn't have `additionalInfo`", () => {
    const { queryByTestId } = render(
      <PdreSettingsTable
        currentUser={mockOrgAdmin}
        settings={[defaultTaskFetchLimit]}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    expect(queryByTestId("setting-help")).not.toBeInTheDocument();
  });

  it("renders `LoadingTable` if loading is true", () => {
    const { getByTestId, queryByTestId } = render(
      <PdreSettingsTable
        currentUser={mockOrgAdmin}
        settings={mockPdreSettings}
        loading={true}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    expect(getByTestId("pdre-settings-loading")).toBeInTheDocument();
    expect(queryByTestId("pdre-settings-table")).not.toBeInTheDocument();
  });

  it("doesnt render `LoadingTable` if loading is false", () => {
    const { getByTestId, queryByTestId } = render(
      <PdreSettingsTable
        currentUser={mockOrgAdmin}
        settings={mockPdreSettings}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    expect(getByTestId("pdre-settings-table")).toBeInTheDocument();
    expect(queryByTestId("pdre-settings-loading")).not.toBeInTheDocument();
  });

  it("enables `Edit` for OrgAdmin", () => {
    const { getAllByText } = render(
      <PdreSettingsTable
        currentUser={mockOrgAdmin}
        settings={mockPdreSettings}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    const edits = getAllByText("Edit");
    expect(edits).toHaveLength(mockPdreSettings.length);
    edits.forEach((edit) => {
      expect(edit).toBeEnabled();
    });
  });

  it("disables `Edit` for Admin", () => {
    const { getAllByText } = render(
      <PdreSettingsTable
        currentUser={mockAdmin}
        settings={mockPdreSettings}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    const edits = getAllByText("Edit");
    expect(edits).toHaveLength(mockPdreSettings.length);
    edits.forEach((edit) => {
      expect(edit).toBeDisabled();
    });
  });

  it("disables `Edit` for Viewer", () => {
    const { getAllByText } = render(
      <PdreSettingsTable
        currentUser={mockViewer}
        settings={mockPdreSettings}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    const edits = getAllByText("Edit");
    expect(edits).toHaveLength(mockPdreSettings.length);
    edits.forEach((edit) => {
      expect(edit).toBeDisabled();
    });
  });

  it("renders tooltip for `Edit` if disabled", () => {
    const { getAllByText, getByRole } = render(
      <PdreSettingsTable
        currentUser={mockViewer}
        settings={mockPdreSettings}
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
      <PdreSettingsTable
        currentUser={mockOrgAdmin}
        settings={mockPdreSettings}
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
      <PdreSettingsTable
        currentUser={mockOrgAdmin}
        settings={mockPdreSettings}
        loading={false}
        onEditClick={mockOnEditClick}
      />,
      { wrapper }
    );

    // assume row order matches mockPdreSettings
    fireEvent.click(getAllByText("Edit")[0]);
    expect(mockOnEditClick.mock.calls[0][0].id).toEqual(mockPdreSettings[0].id);
  });
});

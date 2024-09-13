import { fireEvent, render, waitFor } from "@testing-library/react";
import { ThemeProvider } from "../../../theme";
import {
  generateDummyDataConnectors,
  generateDummyDataSources,
  generateDummySites,
  mockAdmin,
  mockOrgAdmin,
  mockViewer
} from "../../../view/testing/mocks";
import { DataConnectionTable } from "./data-connection-table";
import { generateDummyApps } from "@vizexplorer/global-ui-core";
import { displaySchedule } from "./utils";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { MockedProvider } from "../../../view/testing";
import { AppId, GaUserFragment } from "generated-graphql";

const mockApps = generateDummyApps(3).map((app) => ({ ...app, id: AppId.Pdr }));
const mockSites = generateDummySites(2);
const mockConnector = generateDummyDataConnectors(1)[0];
const mockSource = generateDummyDataSources(1)[0];

function wrapper({ children }: any) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MockedProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </MockedProvider>
    </LocalizationProvider>
  );
}

describe("<DataConnectionTable />", () => {
  const mockOnClickEdit = jest.fn();

  beforeEach(() => {
    mockOnClickEdit.mockReset();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <DataConnectionTable
        currentUser={mockOrgAdmin}
        dataSources={[]}
        dataConnectors={[]}
        onClickEdit={mockOnClickEdit}
      />,
      { wrapper }
    );

    expect(getByTestId("data-connection-table")).toBeInTheDocument();
  });

  it("renders expected columns", () => {
    const { getByText } = render(
      <DataConnectionTable
        currentUser={mockOrgAdmin}
        dataSources={[]}
        dataConnectors={[]}
        onClickEdit={mockOnClickEdit}
      />,
      { wrapper }
    );

    expect(getByText("VizOnDemand Property")).toBeInTheDocument();
    expect(getByText("Source Connection")).toBeInTheDocument();
    expect(getByText("Data Refresh Time")).toBeInTheDocument();
  });

  it("renders expected actions", () => {
    const { getByText } = render(
      <DataConnectionTable
        currentUser={mockOrgAdmin}
        dataSources={[mockSource]}
        dataConnectors={[mockConnector]}
        onClickEdit={mockOnClickEdit}
      />,
      { wrapper }
    );

    expect(getByText("Edit")).toBeInTheDocument();
  });

  it("renders connection information", () => {
    const { getByText } = render(
      <DataConnectionTable
        currentUser={mockOrgAdmin}
        dataSources={[mockSource]}
        dataConnectors={[mockConnector]}
        onClickEdit={mockOnClickEdit}
      />,
      { wrapper }
    );

    expect(getByText(mockSites[0].name)).toBeInTheDocument();
    expect(getByText(mockConnector.name!)).toBeInTheDocument();
    expect(getByText(mockSource.connectorParams!.siteId)).toBeInTheDocument();
    expect(
      getByText(displaySchedule(mockConnector.dataRefreshTime!))
    ).toBeInTheDocument();
  });

  it("runs `onClickEdit` if Edit is clicked", () => {
    const { getByText } = render(
      <DataConnectionTable
        currentUser={mockOrgAdmin}
        dataSources={[mockSource]}
        dataConnectors={[mockConnector]}
        onClickEdit={mockOnClickEdit}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Edit"));
    expect(mockOnClickEdit).toHaveBeenCalled();
  });

  it("allows an `Admin` of the correct app/site to Edit connections", () => {
    const allowedAdmin: GaUserFragment = {
      ...mockAdmin,
      accessList: [
        {
          app: mockApps[0],
          site: mockSites[0],
          role: { __typename: "AppRole", id: "admin", name: "Admin" }
        }
      ]
    };
    const { getByText } = render(
      <DataConnectionTable
        currentUser={allowedAdmin}
        dataSources={[mockSource]}
        dataConnectors={[mockConnector]}
        onClickEdit={mockOnClickEdit}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Edit"));
    expect(mockOnClickEdit).toHaveBeenCalled();
  });

  it("doesn't allow `Admin` of unrelated app/site to Edit the connection", async () => {
    const { getByText } = render(
      <DataConnectionTable
        currentUser={mockAdmin}
        dataSources={[mockSource]}
        dataConnectors={[mockConnector]}
        onClickEdit={mockOnClickEdit}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Edit"));
    expect(mockOnClickEdit).not.toHaveBeenCalled();
    fireEvent.mouseOver(getByText("Edit"));
    await waitFor(() => {
      expect(getByText("You don't have permission", { exact: false }));
    });
  });

  it("doesn't allow `Viewer` to Edit connections", async () => {
    const { getByText } = render(
      <DataConnectionTable
        currentUser={mockViewer}
        dataSources={[mockSource]}
        dataConnectors={[mockConnector]}
        onClickEdit={mockOnClickEdit}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Edit"));
    expect(mockOnClickEdit).not.toHaveBeenCalled();
    fireEvent.mouseOver(getByText("Edit"));
    await waitFor(() => {
      expect(getByText("You don't have permission", { exact: false }));
    });
  });
});

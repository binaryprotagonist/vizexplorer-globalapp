import { fireEvent, render } from "@testing-library/react";
import { PropertiesTable } from "./properties-table";
import { ActionType } from "./types";
import { ThemeProvider } from "../../theme";
import { SiteFragment } from "generated-graphql";
import {
  mockAdmin,
  mockOrgAdmin,
  mockViewer,
  generateDummySites
} from "../../view/testing/mocks";
import { produce } from "immer";
import { act } from "react-dom/test-utils";
import * as buildUtils from "../../utils";

jest.mock("../../utils", () => ({
  isAdminBuild: jest.fn()
}));

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("<PropertiesTable />", () => {
  let mockProperties: SiteFragment[] = [];

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    (buildUtils.isAdminBuild as jest.Mock).mockImplementation(() => false);
    mockProperties = generateDummySites(3);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <PropertiesTable
        currentUser={mockOrgAdmin}
        properties={mockProperties}
        companyName={""}
        onActionClick={() => {}}
      />,
      { wrapper }
    );

    expect(getByTestId("properties-table")).toBeInTheDocument();
  });

  it("renders the Org/Company name", () => {
    const companyName = "Test Company Name";
    const { getByText } = render(
      <PropertiesTable
        currentUser={mockOrgAdmin}
        properties={mockProperties}
        companyName={companyName}
        onActionClick={() => {}}
      />,
      { wrapper }
    );

    expect(getByText(`${companyName} Properties`)).toBeInTheDocument();
  });

  it("renders properties name", () => {
    const { getByText } = render(
      <PropertiesTable
        currentUser={mockOrgAdmin}
        properties={mockProperties}
        companyName={""}
        onActionClick={() => {}}
      />,
      { wrapper }
    );

    mockProperties.forEach((property) => {
      expect(getByText(property.name)).toBeInTheDocument();
    });
  });

  it("renders timezone", () => {
    mockProperties = produce(mockProperties, (draft) => {
      draft[0].tz = "UTC";
      draft[1].tz = "Pacific/Marquesas";
      draft[2].tz = "America/Juneau";
    });
    const { getByText } = render(
      <PropertiesTable
        currentUser={mockOrgAdmin}
        properties={mockProperties}
        companyName={""}
        onActionClick={() => {}}
      />,
      { wrapper }
    );

    expect(getByText("Coordinated Universal Time (UTC)")).toBeInTheDocument();
    expect(getByText("Pacific/Marquesas (GMT-09:30)")).toBeInTheDocument();
    expect(getByText("America/Juneau (GMT-09:00)")).toBeInTheDocument();
  });

  it("renders properties currency", () => {
    mockProperties = produce(mockProperties, (draft) => {
      draft[0].currency = undefined;
      draft[1].currency!.code = "USD";
      draft[2].currency!.code = "EUR";
    });
    const { getByText } = render(
      <PropertiesTable
        currentUser={mockOrgAdmin}
        properties={mockProperties}
        companyName={""}
        onActionClick={() => {}}
      />,
      { wrapper }
    );

    expect(getByText("None")).toBeInTheDocument();
    expect(getByText("$ USD")).toBeInTheDocument();
    expect(getByText("€ EUR")).toBeInTheDocument();
  });

  it("renders actions for each property", () => {
    const { getAllByText } = render(
      <PropertiesTable
        currentUser={mockOrgAdmin}
        properties={mockProperties}
        companyName={""}
        onActionClick={() => {}}
      />,
      { wrapper }
    );

    expect(getAllByText("Edit")).toHaveLength(mockProperties.length);
    expect(getAllByText("Delete")).toHaveLength(mockProperties.length);
    expect(getAllByText("Edit")[0]).not.toBeDisabled();
    expect(getAllByText("Delete")[0]).not.toBeDisabled();
  });

  it("runs onActionClick if `Edit` is clicked", () => {
    const mockOnActionClick = jest.fn();
    const { getAllByText } = render(
      <PropertiesTable
        currentUser={mockOrgAdmin}
        properties={mockProperties}
        companyName={""}
        onActionClick={mockOnActionClick}
      />,
      { wrapper }
    );

    fireEvent.click(getAllByText("Edit")[2]);

    expect(mockOnActionClick.mock.calls[0][0]).toEqual(ActionType.EDIT);
    expect(mockOnActionClick.mock.calls[0][1].id).toEqual(mockProperties[2].id);
    expect(mockOnActionClick.mock.calls[0][1].name).toEqual(mockProperties[2].name);
  });

  it("runs onActionClick if `Delete` is clicked", () => {
    const mockOnActionClick = jest.fn();
    const { getAllByText } = render(
      <PropertiesTable
        currentUser={mockOrgAdmin}
        properties={mockProperties}
        companyName={""}
        onActionClick={mockOnActionClick}
      />,
      { wrapper }
    );

    fireEvent.click(getAllByText("Delete")[2]);
    expect(mockOnActionClick.mock.calls[0][0]).toEqual(ActionType.DELETE);
    expect(mockOnActionClick.mock.calls[0][1].id).toEqual(mockProperties[2].id);
    expect(mockOnActionClick.mock.calls[0][1].name).toEqual(mockProperties[2].name);
  });

  it("disables `Delete` if only 1 property exists", () => {
    const property = generateDummySites(1)[0];
    const { getByText } = render(
      <PropertiesTable
        currentUser={mockOrgAdmin}
        properties={[property]}
        companyName={""}
        onActionClick={() => {}}
      />,
      { wrapper }
    );

    act(() => {
      fireEvent.mouseOver(getByText("Delete"));
      jest.runAllTimers(); // wait for tooltip to show
    });

    expect(getByText("Delete")).toBeDisabled();
    expect(
      getByText("Your organization should have at least one property")
    ).toBeInTheDocument();
  });

  it("doesn't render Property ID column for App Build", () => {
    const { queryByText } = render(
      <PropertiesTable
        currentUser={mockOrgAdmin}
        properties={mockProperties}
        companyName={""}
        onActionClick={() => {}}
      />,
      { wrapper }
    );

    expect(queryByText("Property ID")).not.toBeInTheDocument();
  });

  it("renders Property ID column for Admin Build", () => {
    (buildUtils.isAdminBuild as jest.Mock).mockImplementation(() => true);
    const { getByText } = render(
      <PropertiesTable
        currentUser={mockOrgAdmin}
        properties={mockProperties}
        companyName={""}
        onActionClick={() => {}}
      />,
      { wrapper }
    );

    expect(getByText("Property ID")).toBeInTheDocument();
  });

  describe("Permissions", () => {
    it("enables all actions for `OrgAdmin`", () => {
      const { getAllByText } = render(
        <PropertiesTable
          currentUser={mockOrgAdmin}
          properties={mockProperties}
          companyName={""}
          onActionClick={() => {}}
        />,
        { wrapper }
      );
      const actions = [...getAllByText("Edit"), ...getAllByText("Delete")];
      actions.forEach((action) => {
        expect(action).toBeEnabled();
      });
    });

    it("disables all actions for `Admin`", () => {
      const { getAllByText } = render(
        <PropertiesTable
          currentUser={{ ...mockAdmin }}
          properties={mockProperties}
          companyName={""}
          onActionClick={() => {}}
        />,
        { wrapper }
      );
      const actions = [...getAllByText("Edit"), ...getAllByText("Delete")];
      actions.forEach((action) => {
        expect(action).toBeDisabled();
      });
    });

    it("disables all actions for `Viewer`", () => {
      const { getAllByText } = render(
        <PropertiesTable
          currentUser={mockViewer}
          properties={mockProperties}
          companyName={""}
          onActionClick={() => {}}
        />,
        { wrapper }
      );
      const actions = [...getAllByText("Edit"), ...getAllByText("Delete")];
      actions.forEach((action) => {
        expect(action).toBeDisabled();
      });
    });
  });
});

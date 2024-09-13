import { fireEvent, render } from "@testing-library/react";
import { Properties } from "./properties";
import { MockAuthProvider, MockRecoilProvider } from "@vizexplorer/global-ui-core";
import { ThemeProvider } from "../../theme";
import { GlobalMockedProvider } from "../../view/testing";
import {
  GaCompanyFragment,
  GaUserFragment,
  OrgFeatures,
  SiteFragment
} from "generated-graphql";
import {
  mockAdmin,
  mockOrgAdmin,
  mockViewer,
  generateDummySites,
  mockSitesQuery,
  mockCompanyQuery,
  mockCurrentUserQuery,
  mockCompany
} from "../../view/testing/mocks";
import { BrowserRouter } from "react-router-dom";
import { mockCurrentOrgFeaturesQuery } from "testing/mocks/org";
import * as buildUtils from "../../utils";

jest.mock("../../utils", () => ({
  isAdminBuild: jest.fn()
}));

describe("<Properties />", () => {
  let currentUser: GaUserFragment = null as any;
  let company: Partial<GaCompanyFragment> = null as any;
  let orgFeatures: OrgFeatures = null as any;
  let mockSites: SiteFragment[] = [];

  beforeAll(() => {
    (buildUtils.isAdminBuild as jest.Mock).mockImplementation(() => false);
  });

  beforeEach(() => {
    currentUser = mockOrgAdmin;
    company = mockCompany;
    orgFeatures = {
      multiProperties: true
    };
    mockSites = generateDummySites(3);
  });

  function wrapper({ children }: any) {
    return (
      <MockRecoilProvider>
        <MockAuthProvider>
          <GlobalMockedProvider
            mocks={[
              mockSitesQuery(mockSites),
              mockCurrentUserQuery(currentUser),
              mockCurrentOrgFeaturesQuery(company.id!, orgFeatures),
              mockCurrentOrgFeaturesQuery(company.id!, orgFeatures),
              mockCompanyQuery(company),
              mockCurrentUserQuery(currentUser)
            ]}
          >
            <ThemeProvider>
              <BrowserRouter>{children}</BrowserRouter>
            </ThemeProvider>
          </GlobalMockedProvider>
        </MockAuthProvider>
      </MockRecoilProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(<Properties />, { wrapper });

    expect(getByTestId("properties")).toBeInTheDocument();
  });

  it("renders add property button", async () => {
    const { findByTestId } = render(<Properties />, { wrapper });

    await findByTestId("add-property-btn");
  });

  it("renders properties table with expected company and site information", async () => {
    const { findByTestId, getByText, getAllByText } = render(<Properties />, {
      wrapper
    });

    await findByTestId("properties-table");
    expect(getByText(`${mockCompany.name} Properties`)).toBeInTheDocument();
    expect(getByText(mockSites[0].name)).toBeInTheDocument();
    expect(getByText(mockSites[1].name)).toBeInTheDocument();
    expect(getAllByText("Edit")).toHaveLength(mockSites.length);
    expect(getAllByText("Delete")).toHaveLength(mockSites.length);
  });

  it("doesnt render content while loading", async () => {
    const { queryByTestId } = render(<Properties />, { wrapper });

    expect(queryByTestId("properties-table")).not.toBeInTheDocument();
    expect(queryByTestId("add-property-btn")).not.toBeInTheDocument();
  });

  it("disables Add Property if a property exists and `multiProperties` is `false`", async () => {
    mockSites = generateDummySites(1);
    orgFeatures = { multiProperties: false };
    const { getByTestId, getByRole, findByTestId, findByRole } = render(<Properties />, {
      wrapper
    });

    await findByTestId("add-property-btn");
    fireEvent.mouseOver(getByTestId("add-property-btn"));
    await findByRole("tooltip"); // tooltip has 100ms delay

    expect(getByTestId("add-property-btn")).toBeDisabled();
    expect(getByRole("tooltip")).toHaveTextContent(/single property plan/);
  });

  it("renders Add Site Dialog upon clicking `Add Property` button", async () => {
    const { getByTestId, findByTestId } = render(<Properties />, { wrapper });

    await findByTestId("add-property-btn");
    fireEvent.click(getByTestId("add-property-btn"));
    expect(getByTestId("manage-site-dialog")).toBeInTheDocument();
    expect(getByTestId("manage-site-dialog")).toHaveTextContent("Add Property");
  });

  it("can close the Add Site Dialog", async () => {
    const { getByTestId, getByText, queryByTestId, findByTestId } = render(
      <Properties />,
      { wrapper }
    );

    await findByTestId("add-property-btn");
    fireEvent.click(getByTestId("add-property-btn"));
    expect(getByTestId("manage-site-dialog")).toBeInTheDocument();

    fireEvent.click(getByText("Cancel"));
    expect(queryByTestId("manage-site-dialog")).not.toBeInTheDocument();
  });

  it("renders Update Site Dialog upon clicking `Update` button", async () => {
    mockSites = generateDummySites(1);
    const { getByTestId, getByText, findByTestId } = render(<Properties />, {
      wrapper
    });

    await findByTestId("properties-table");
    fireEvent.click(getByText("Edit"));

    const nameInput = getByTestId("property-name-input").querySelector("input");
    expect(getByTestId("manage-site-dialog")).toBeInTheDocument();
    expect(nameInput).toHaveAttribute("value", mockSites[0].name);
  });

  it("can close the Edit Site Dialog", async () => {
    mockSites = generateDummySites(1);
    const { getByTestId, getByText, queryByTestId, findByTestId } = render(
      <Properties />,
      { wrapper }
    );

    await findByTestId("properties-table");
    fireEvent.click(getByText("Edit"));
    expect(getByTestId("manage-site-dialog")).toBeInTheDocument();

    fireEvent.click(getByText("Cancel"));
    expect(queryByTestId("manage-site-dialog")).not.toBeInTheDocument();
  });

  it("renders Delete Site Dialog upon clicking `Delete` button", async () => {
    mockSites = generateDummySites(2);
    const { getByTestId, getAllByText, findByTestId } = render(<Properties />, {
      wrapper
    });

    await findByTestId("properties-table");
    fireEvent.click(getAllByText("Delete")[0]);

    expect(getByTestId("delete-site-dialog")).toBeInTheDocument();
  });

  it("can close the Delete Site Dialog", async () => {
    mockSites = generateDummySites(2);
    const { getByTestId, getByText, getAllByText, queryByTestId, findByTestId } = render(
      <Properties />,
      {
        wrapper
      }
    );

    await findByTestId("properties-table");
    fireEvent.click(getAllByText("Delete")[0]);
    expect(getByTestId("delete-site-dialog")).toBeInTheDocument();

    fireEvent.click(getByText("Cancel"));
    expect(queryByTestId("delete-site-dialog")).not.toBeInTheDocument();
  });

  it("doesn't render MultiProperty switch for app build", async () => {
    const { queryByTestId, findByTestId } = render(<Properties />, {
      wrapper
    });

    await findByTestId("properties-table");
    expect(queryByTestId("multi-property-switch")).not.toBeInTheDocument();
  });

  describe("permissions", () => {
    it("enables Add Property button for `OrgAdmin`", async () => {
      const { findByTestId } = render(<Properties />, { wrapper });

      await findByTestId("add-property-btn");
    });

    it("disables Add Property button for `Admin`", async () => {
      currentUser = { ...mockAdmin };
      const { getByTestId, getByRole, findByTestId, findByRole } = render(
        <Properties />,
        { wrapper }
      );

      await findByTestId("add-property-btn");
      fireEvent.mouseOver(getByTestId("add-property-btn"));
      await findByRole("tooltip");

      expect(getByTestId("add-property-btn")).toBeDisabled();
      expect(getByRole("tooltip")).toHaveTextContent(/don't have permission/);
    });

    it("disables Add Property button for `Viewer`", async () => {
      currentUser = mockViewer;
      const { getByTestId, getByRole, findByTestId, findByRole } = render(
        <Properties />,
        { wrapper }
      );

      await findByTestId("add-property-btn");
      fireEvent.mouseOver(getByTestId("add-property-btn"));
      await findByRole("tooltip");

      expect(getByTestId("add-property-btn")).toBeDisabled();
      expect(getByRole("tooltip")).toHaveTextContent(/don't have permission/);
    });
  });

  describe("Admin Build", () => {
    beforeAll(() => {
      (buildUtils.isAdminBuild as jest.Mock).mockImplementation(() => true);
    });

    it("renders MultiProperty switch", async () => {
      const { findByTestId } = render(<Properties />, {
        wrapper
      });

      await findByTestId("multi-property-switch");
    });
  });
});

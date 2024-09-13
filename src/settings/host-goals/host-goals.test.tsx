import {
  act,
  fireEvent,
  render,
  waitForElementToBeRemoved,
  within
} from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { HostGoals } from "./host-goals";
import { GaUserFragment } from "generated-graphql";
import {
  mockAdmin,
  mockCurrentUserQuery,
  mockOrgAdmin,
  mockPDEngageAdminAccess
} from "testing/mocks";
import {
  generateDummyPrograms,
  generateDummySites,
  mockSitesQuery,
  mockGoalProgramsQuery,
  MockGoalProgramsQueryOpts,
  mockGoalProgramDeleteMutation
} from "./__mocks__/host-goals";
import { History, createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { SiteSelectSiteFragment } from "view-v2/site-select/__generated__/site-select";
import { ProgramCardProgramFragment } from "./__generated__/program-card";
import { produce } from "immer";
import { getInput, updateInput } from "testing/utils";

const pdEngageSingleSiteAdmin = produce(mockAdmin, (draft) => {
  draft.accessList = [mockPDEngageAdminAccess];
});

const siteId = mockPDEngageAdminAccess.site.id;

describe("<HostGoals />", () => {
  let programRequests: MockGoalProgramsQueryOpts[];
  let mockSites: SiteSelectSiteFragment[];
  let currentUser: GaUserFragment;
  let programs: ProgramCardProgramFragment[];
  let history: History = null as any;

  beforeEach(() => {
    mockSites = generateDummySites(3);
    currentUser = pdEngageSingleSiteAdmin;
    programs = generateDummyPrograms(3);
    programRequests = [{ programs }];
    history = createMemoryHistory();
  });

  function wrapper({ children }: any) {
    return (
      <MockedProvider
        mocks={[
          ...programRequests.map(mockGoalProgramsQuery),
          mockCurrentUserQuery(currentUser),
          mockCurrentUserQuery(currentUser),
          mockSitesQuery(mockSites),
          mockSitesQuery(mockSites), //refetch
          mockGoalProgramDeleteMutation(programs[0].id, siteId)
        ]}
      >
        <Router navigator={history} location={history.location}>
          {children}
        </Router>
      </MockedProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(<HostGoals />, { wrapper });
    expect(getByTestId("host-goals")).toBeInTheDocument();
  });

  it("renders Host Goals title", () => {
    const { getByText } = render(<HostGoals />, { wrapper });

    expect(getByText("Host Goals")).toBeInTheDocument();
  });

  it("doesn't render site select for single site access", async () => {
    const { queryByTestId } = render(<HostGoals />, { wrapper });

    expect(queryByTestId("site-select")).not.toBeInTheDocument();
  });

  it("doesn't render site select during initial load", async () => {
    const { queryByTestId } = render(<HostGoals />, {
      wrapper
    });

    expect(queryByTestId("site-select")).not.toBeInTheDocument();
  });

  it("continues to render site select during host-goals load after selecting a property", async () => {
    currentUser = mockOrgAdmin;
    const { findByTestId, getByText, getByTestId } = render(<HostGoals />, {
      wrapper
    });

    const siteSelect = await findByTestId("site-select");
    fireEvent.mouseDown(within(siteSelect).getByRole("combobox"));
    fireEvent.click(getByText(mockSites[0].name));

    expect(getByTestId("site-select")).toBeInTheDocument();
  });

  it("selects the correct site when a valid siteId query parameter is provided", async () => {
    currentUser = mockOrgAdmin;
    programRequests.push({ programs, vars: { siteId: "1" } });
    history.push(`?siteId=${mockSites[1].id}`);
    const { findByTestId, getByText } = render(<HostGoals />, { wrapper });

    await findByTestId("site-select");

    expect(getByText(mockSites[1].name)).toBeInTheDocument();
  });

  it("does not select any site when an invalid siteId query parameter is provided", async () => {
    currentUser = mockOrgAdmin;
    history.push("?siteId=invalid-site-id");
    const { findByTestId, getByTestId } = render(<HostGoals />, { wrapper });

    await findByTestId("site-select");

    expect(getByTestId("no-site-selection")).toBeInTheDocument();
  });

  it("navigates to host goal creation url when clicking on the Add program button", async () => {
    currentUser = mockOrgAdmin;
    programRequests.push({ programs, vars: { siteId: "1" } });
    history.push(`?siteId=${mockSites[1].id}`);
    const { findByTestId, getByTestId } = render(<HostGoals />, { wrapper });

    await findByTestId("site-select");

    fireEvent.click(getByTestId("add-program-btn"));

    expect(history.location.pathname).toEqual("/sites/1/new");
  });

  it("renders no programs card if there are no programs", async () => {
    programRequests[0].programs = [];
    const { findByTestId } = render(<HostGoals />, { wrapper });

    await findByTestId("no-programs");
  });

  it("renders no site selection if no property is selected", async () => {
    currentUser = mockOrgAdmin;
    const { getAllByTestId, getByTestId } = render(<HostGoals />, { wrapper });

    const programsLoading = getAllByTestId("programs-loading")[0];
    await waitForElementToBeRemoved(programsLoading);

    expect(getByTestId("no-site-selection")).toBeInTheDocument();
  });

  it("renders program list when a property is selected", async () => {
    const { findByTestId } = render(<HostGoals />, { wrapper });

    await findByTestId("program-list");
  });

  it("doesn't render program list when a property isn't selected", async () => {
    currentUser = mockOrgAdmin;
    const { getAllByTestId, getByTestId, queryByTestId } = render(<HostGoals />, {
      wrapper
    });

    const programsLoading = getAllByTestId("programs-loading")[0];
    await waitForElementToBeRemoved(programsLoading);

    expect(getByTestId("no-site-selection")).toBeInTheDocument();
    expect(queryByTestId("program-list")).not.toBeInTheDocument();
  });

  it("doesn't render unexpected program content while loading APIs", () => {
    currentUser = mockOrgAdmin;
    const { queryByTestId } = render(<HostGoals />, {
      wrapper
    });

    expect(queryByTestId("no-search-results")).not.toBeInTheDocument();
    expect(queryByTestId("no-site-selection")).not.toBeInTheDocument();
    expect(queryByTestId("no-programs")).not.toBeInTheDocument();
  });

  it("renders Program Detail if Expand button is clicked", async () => {
    const { findAllByTestId, getByTestId } = render(<HostGoals />, {
      wrapper
    });

    const allPrograms = await findAllByTestId("program-card");
    fireEvent.click(within(allPrograms[0]).getByTestId("expand-program"));

    expect(getByTestId("program-detail")).toBeInTheDocument();
  });

  it("closes expanded card when expansion button is clicked while open", async () => {
    jest.useFakeTimers();
    const { findAllByTestId, queryByTestId } = render(<HostGoals />, {
      wrapper
    });

    const allPrograms = await findAllByTestId("program-card");
    fireEvent.click(within(allPrograms[0]).getByTestId("expand-program"));
    fireEvent.click(within(allPrograms[0]).getByTestId("expand-program"));

    // wait for the component to unmount after the transition
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(queryByTestId("program-detail")).not.toBeInTheDocument();

    jest.useRealTimers();
  });

  it("can search on Program name", async () => {
    const { getByTestId, findAllByTestId, getAllByTestId } = render(<HostGoals />, {
      wrapper
    });

    await findAllByTestId("program-list");

    const programName = programRequests[0].programs![0].name;
    updateInput(getByTestId("host-goals-search"), programName);

    expect(getAllByTestId("program-card")).toHaveLength(1);
    expect(getInput(getByTestId("host-goals-search"))).toHaveValue(programName);
  });

  it("renders No Search Results component if there are no programs matching the search", async () => {
    const { getByTestId, findAllByTestId } = render(<HostGoals />, {
      wrapper
    });

    await findAllByTestId("program-list");

    updateInput(getByTestId("host-goals-search"), "non matching search");
    expect(getByTestId("no-search-results")).toBeInTheDocument();
  });

  it("navigates to host goal edit url when clicking on the Edit program button", async () => {
    const { findAllByTestId } = render(<HostGoals />, {
      wrapper
    });

    const allPrograms = await findAllByTestId("program-card");
    fireEvent.click(within(allPrograms[0]).getByTestId("edit-program"));

    expect(history.location.pathname).toEqual(`/sites/0/programs/${programs[0].id}/edit`);
  });

  it("navigates to host goal duplicate url when clicking on the Duplicate program button", async () => {
    const { findAllByTestId } = render(<HostGoals />, {
      wrapper
    });

    const allPrograms = await findAllByTestId("program-card");
    fireEvent.click(within(allPrograms[0]).getByTestId("duplicate-program"));

    expect(history.location.pathname).toEqual(
      `/sites/0/programs/${programs[0].id}/duplicate`
    );
  });

  it("navigates to `Program dashboard` when clicking on the program name", async () => {
    const { findAllByTestId } = render(<HostGoals />, {
      wrapper
    });

    const allPrograms = await findAllByTestId("program-card");
    fireEvent.click(within(allPrograms[0]).getByTestId("program-name"));

    expect(history.location.pathname).toEqual(
      `/sites/0/programs/${programs[0].id}/dashboard`
    );
  });

  it("displays DeleteProgramDialog if delete is clicked on a program", async () => {
    const { findAllByTestId, getByTestId } = render(<HostGoals />, { wrapper });

    const allPrograms = await findAllByTestId("program-card");
    fireEvent.click(within(allPrograms[0]).getByTestId("delete-program"));

    const dialog = getByTestId("delete-program-dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(programRequests[0].programs![0].name);
  });

  it("can delete a program successfully", async () => {
    programRequests.push({ programs: [], errors: [] }); // refetch on delete
    const { findAllByTestId, getByTestId } = render(<HostGoals />, {
      wrapper
    });

    const allPograms = await findAllByTestId("program-card");
    fireEvent.click(within(allPograms[0]).getByTestId("delete-program"));

    const deleteDialog = getByTestId("delete-program-dialog");
    fireEvent.click(within(deleteDialog).getByText("Delete"));

    await waitForElementToBeRemoved(allPograms[0]);
  });
});

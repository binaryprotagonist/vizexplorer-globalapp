import { render, waitFor } from "@testing-library/react";
import { MockedProvider } from "testing/graphql-provider";
import { Route, Router, Routes } from "react-router-dom";
import { History, createMemoryHistory } from "history";
import MarketingListCreate from "./marketing-list-create";
import {
  mockAdmin,
  mockCurrentUserQuery,
  mockPDEngageAdminAccess,
  mockSrasAdminAccess
} from "testing/mocks";
import { GaUserFragment } from "generated-graphql";
import { produce } from "immer";
import { mockMarketingProgramsQuery } from "./marketing-list-builder/__mocks__/marketing-list-builder";

const mockPDEngageAdmin = produce(mockAdmin, (draft) => {
  draft.accessList = [mockPDEngageAdminAccess];
});
const mockSrasAdmin = produce(mockAdmin, (draft) => {
  draft.accessList = [mockSrasAdminAccess];
});

describe("<MarketingListCreate />", () => {
  let history: History;
  let currentUser: GaUserFragment;

  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ["/settings/marketing-lists/sites/0/new"]
    });
    currentUser = mockPDEngageAdmin;
  });

  function wrapper({ children }: any) {
    return (
      <MockedProvider
        mocks={[mockCurrentUserQuery(currentUser), mockMarketingProgramsQuery()]}
      >
        <Router navigator={history} location={history.location}>
          <Routes>
            <Route path={"/settings/marketing-lists/*"}>
              <Route path={"sites/:siteId/new"} element={children} />
            </Route>
          </Routes>
        </Router>
      </MockedProvider>
    );
  }

  it("renders", async () => {
    const { findByTestId } = render(<MarketingListCreate />, { wrapper });

    await findByTestId("marketing-list-create");
  });

  it("navigates the user back without a siteId param if the user doesn't have site access", async () => {
    currentUser = mockSrasAdmin;
    render(<MarketingListCreate />, { wrapper });

    await waitFor(() => {
      expect(history.location.pathname).toBe("/settings/marketing-lists");
    });
  });

  it("renders MarketingListBuilder", async () => {
    const { findByTestId } = render(<MarketingListCreate />, { wrapper });

    await findByTestId("marketing-list-builder");
  });
});

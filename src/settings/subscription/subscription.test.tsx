import { render } from "@testing-library/react";
import { Subscription } from "./subscription";
import { ThemeProvider } from "../../theme";
import { MockAuthProvider, mockDeliveryMethodQuery } from "@vizexplorer/global-ui-core";
import { RecoilRoot } from "recoil";
import {
  mockAppSubscriptionsQuery,
  mockCompanyQuery,
  mockCurrentUserQuery,
  generateDummyAppSubscriptions,
  mockCompany
} from "../../view/testing/mocks";
import { InMemoryCache } from "@apollo/client";
import { cacheConfig } from "../../view/graphql";
import { BrowserRouter } from "react-router-dom";
import { Environment, isOnprem } from "./subscriptions";
import { AppSubscriptionFragment } from "generated-graphql";
import { MockedProvider } from "@apollo/client/testing";

// don't need to render actual component and worry about its APIs - only that it is to be rendered
jest.mock("./license-version", () => ({
  LicenseVersion: () => <div data-testid={"mock-license-version"} />
}));

describe("<Subscription />", () => {
  let currentEnvironment: Environment;
  let apps: AppSubscriptionFragment[];

  beforeEach(() => {
    currentEnvironment = Environment.CLOUD;
    apps = generateDummyAppSubscriptions(1);
  });

  function wrapper({ children }: any) {
    return (
      <RecoilRoot>
        <MockAuthProvider>
          <MockedProvider
            cache={new InMemoryCache(cacheConfig)}
            mocks={[
              mockAppSubscriptionsQuery(apps),
              mockCompanyQuery(mockCompany),
              mockCurrentUserQuery(),
              mockDeliveryMethodQuery(isOnprem(currentEnvironment))
            ]}
          >
            <ThemeProvider>
              <BrowserRouter>{children}</BrowserRouter>
            </ThemeProvider>
          </MockedProvider>
        </MockAuthProvider>
      </RecoilRoot>
    );
  }

  it("renders", async () => {
    const { findByTestId } = render(<Subscription />, { wrapper });

    await findByTestId("subscription");
  });

  it("renders Subscription Table", async () => {
    const { findByTestId } = render(<Subscription />, { wrapper });

    await findByTestId("subscription-table");
  });

  it("renders company name in the Subscription Table title", async () => {
    const { findByText } = render(<Subscription />, { wrapper });

    await findByText(`${mockCompany.name} Subscriptions`);
  });

  it("renders Payment Info", async () => {
    const { findByTestId } = render(<Subscription />, { wrapper });

    await findByTestId("payment-info");
  });

  it("renders License Version", async () => {
    const { findByTestId } = render(<Subscription />, { wrapper });

    await findByTestId("mock-license-version");
  });
});

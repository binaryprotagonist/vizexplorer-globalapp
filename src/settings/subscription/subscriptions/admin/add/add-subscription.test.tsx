import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { fireEvent, render } from "@testing-library/react";
import { ThemeProvider } from "../../../../../theme";
import { AddSubscription } from "./add-subscription";
import { RecoilRoot } from "recoil";
import { MockAuthProvider } from "@vizexplorer/global-ui-core";
import { MockedProvider } from "testing/graphql-provider";
import { mockSubscriptionPlans, mockSubscriptionPlansQuery } from "testing/mocks/admin";
import { generateDummyAppSubscriptions, mockAppSubscriptionsQuery } from "testing/mocks";
import {
  AppId,
  AppSubscriptionFragment,
  SubscriptionPlanFragment
} from "generated-graphql";
import { History, createMemoryHistory } from "history";
import { Outlet, Route, Router, Routes } from "react-router-dom";
import { produce } from "immer";
import { getInput } from "testing/utils";

describe("<AddSubscription />", () => {
  let subPlans: SubscriptionPlanFragment[] = [];
  let appSubs: AppSubscriptionFragment[] = [];
  let history: History = null as any;

  beforeEach(() => {
    subPlans = mockSubscriptionPlans;
    appSubs = [];
    history = createMemoryHistory({
      initialEntries: ["/org/1/subscription/new"]
    });
  });

  function wrapper({ children }: any) {
    return (
      <RecoilRoot>
        <MockAuthProvider>
          <MockedProvider
            mocks={[
              mockSubscriptionPlansQuery(subPlans),
              mockAppSubscriptionsQuery(appSubs)
            ]}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <ThemeProvider>
                <Router navigator={history} location={history.location}>
                  <Routes>
                    <Route path={"/org/1/subscription/*"} element={<Outlet />}>
                      <Route path={"new"} element={children} />
                    </Route>
                  </Routes>
                </Router>
              </ThemeProvider>
            </LocalizationProvider>
          </MockedProvider>
        </MockAuthProvider>
      </RecoilRoot>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(<AddSubscription />, { wrapper });

    expect(getByTestId("add-subscription")).toBeInTheDocument();
  });

  it("renders loading form while loading", async () => {
    const { getByTestId, findByTestId } = render(<AddSubscription />, {
      wrapper
    });

    expect(getByTestId("subscription-form-loading")).toBeInTheDocument();
    await findByTestId("subscription-form");
  });

  it("doesn't display application options with active subscriptions", async () => {
    // add SRE subscription
    appSubs = produce(generateDummyAppSubscriptions(1), (draft) => {
      draft[0].id = AppId.Sre;
    });

    const { getByTestId, getByText, queryByText, findByTestId } = render(
      <AddSubscription />,
      { wrapper }
    );

    await findByTestId("subscription-form");
    fireEvent.keyDown(getByTestId("application-field"), { key: "ArrowDown" });

    expect(getByText("Market Analysis Reporting")).toBeInTheDocument();
    expect(queryByText("Slot Recommendation Engine")).not.toBeInTheDocument();
  });

  it("displays application options if an application subscription is no longer valid", async () => {
    // add invalid SRE subscription
    appSubs = produce(generateDummyAppSubscriptions(1), (draft) => {
      draft[0].id = AppId.Sre;
      draft[0].subscription!.isValid = false;
    });

    const { getByTestId, getByText, findByTestId } = render(<AddSubscription />, {
      wrapper
    });

    await findByTestId("subscription-form");
    fireEvent.keyDown(getByTestId("application-field"), { key: "ArrowDown" });

    expect(getByText("Market Analysis Reporting")).toBeInTheDocument();
    expect(getByText("Slot Recommendation Engine")).toBeInTheDocument();
  });

  it("automatically selects form values where only 1 option exists", async () => {
    // MAR is only Cloud, only Premium and only Annual
    const { getByTestId, getByText, findByTestId } = render(<AddSubscription />, {
      wrapper
    });

    await findByTestId("subscription-form");
    fireEvent.keyDown(getByTestId("application-field"), { key: "ArrowDown" });
    fireEvent.click(getByText("Market Analysis Reporting"));

    const appInput = getInput(getByTestId("application-field"));
    const envInput = getInput(getByTestId("environment-field"));
    const billingInput = getInput(getByTestId("billing-interval-field"));
    const packageInput = getInput(getByTestId("package-type-field"));

    expect(appInput).toHaveValue("Market Analysis Reporting");
    expect(envInput).toHaveValue("Cloud");
    expect(billingInput).toHaveValue("Annual");
    expect(packageInput).toHaveValue("Premium");
  });

  it("doesn't automatically select form values if more than 1 option exists", async () => {
    // unlike MAR, SRE has multiple options for each field
    const { getByTestId, getByText, findByTestId } = render(<AddSubscription />, {
      wrapper
    });

    await findByTestId("subscription-form");
    fireEvent.keyDown(getByTestId("application-field"), { key: "ArrowDown" });
    fireEvent.click(getByText("Slot Recommendation Engine"));

    const appInput = getInput(getByTestId("application-field"));
    const envInput = getInput(getByTestId("environment-field"));
    const billingInput = getInput(getByTestId("billing-interval-field"));
    const packageInput = getInput(getByTestId("package-type-field"));

    expect(appInput).toHaveValue("Slot Recommendation Engine");
    expect(envInput).toHaveValue("");
    expect(billingInput).toHaveValue("");
    expect(packageInput).toHaveValue("");
  });

  it("navigates back to subscription if Cancel is clicked", async () => {
    const { getByTestId, findByTestId } = render(<AddSubscription />, {
      wrapper
    });

    await findByTestId("subscription-form");
    fireEvent.click(getByTestId("cancel-btn"));

    expect(history.location.pathname).toEqual("/org/1/subscription");
  });
});

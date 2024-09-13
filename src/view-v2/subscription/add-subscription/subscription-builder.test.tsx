import { fireEvent, render, within } from "@testing-library/react";
import { ThemeProvider } from "../../../theme";
import { ReducerState } from "./reducer";
import { SubscriptionBuilder } from "./subscription-builder";
import { SubscriptionEnvironment } from "../types";
import { produce } from "immer";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { getInput } from "testing/utils";
import { mockSubBuilderSubPlans } from "./__mocks__/subscription-builder";
import { AppId, BillingInterval } from "generated-graphql";

function wrapper({ children }: any) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider>{children}</ThemeProvider>
    </LocalizationProvider>
  );
}

const initialState: ReducerState = {
  environment: SubscriptionEnvironment.CLOUD,
  environmentOptions: [SubscriptionEnvironment.CLOUD, SubscriptionEnvironment.ONPREM],
  draftSubscriptions: [
    {
      draftSubscription: {
        appId: null,
        billingInterval: null,
        expirationDate: null,
        packageType: null
      },
      options: {
        applications: [AppId.Pdengage, AppId.Sras],
        billingIntervals: [BillingInterval.Annual, BillingInterval.Monthly],
        packageTypes: ["elite", "premium"],
        minExpireDate: new Date()
      }
    }
  ],
  availablePlans: mockSubBuilderSubPlans,
  canAddSubscription: false,
  canSave: false
};

describe("<SubscriptionBuilder />", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <SubscriptionBuilder state={initialState} dispatch={mockDispatch} />,
      { wrapper }
    );

    expect(getByTestId("subscription-builder")).toBeInTheDocument();
  });

  it("renders environment field", () => {
    const { getByTestId } = render(
      <SubscriptionBuilder state={initialState} dispatch={mockDispatch} />,
      { wrapper }
    );

    expect(getByTestId("environment-field")).toBeInTheDocument();
  });

  it("sets environment field value from provided state", () => {
    const { getByTestId } = render(
      <SubscriptionBuilder state={initialState} dispatch={mockDispatch} />,
      { wrapper }
    );

    expect(getInput(getByTestId("environment-field"))).toHaveValue("Cloud");
  });

  it("calls dispatch if environment changes", () => {
    const { getByTestId, getByText } = render(
      <SubscriptionBuilder state={initialState} dispatch={mockDispatch} />,
      { wrapper }
    );

    const select = getByTestId("environment-field");
    fireEvent.click(within(select).getByRole("button", { name: "Open" }));
    fireEvent.click(getByText("On-Premises"));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "UPDATE_ENVIRONMENT",
      payload: { environment: SubscriptionEnvironment.ONPREM }
    });
  });

  it("disables environment field if disabled is true", () => {
    const { getByTestId } = render(
      <SubscriptionBuilder disabled state={initialState} dispatch={mockDispatch} />,
      { wrapper }
    );

    expect(getInput(getByTestId("environment-field"))).toBeDisabled();
  });

  it("disables environment field if loading is true", () => {
    const { getByTestId } = render(
      <SubscriptionBuilder loading state={initialState} dispatch={mockDispatch} />,
      { wrapper }
    );

    expect(getInput(getByTestId("environment-field"))).toBeDisabled();
  });

  it("renders draft subscriptions", () => {
    const { getByTestId } = render(
      <SubscriptionBuilder state={initialState} dispatch={mockDispatch} />,
      { wrapper }
    );

    expect(getByTestId("draft-subscription")).toBeInTheDocument();
  });

  it("renders all draft subscription fields as disabled if environment is not selected", () => {
    const state = produce(initialState, (draft) => {
      draft.environment = undefined;
    });
    const { getByTestId } = render(
      <SubscriptionBuilder state={state} dispatch={mockDispatch} />,
      { wrapper }
    );

    expect(getInput(getByTestId("application-select"))).toBeDisabled();
    expect(getInput(getByTestId("package-type-select"))).toBeDisabled();
    expect(getInput(getByTestId("billing-interval-select"))).toBeDisabled();
    expect(getInput(getByTestId("expiration-date-select"))).toBeDisabled();
  });

  it("enables all but expiration date select if environment is selected", () => {
    const { getByTestId } = render(
      <SubscriptionBuilder state={initialState} dispatch={mockDispatch} />,
      { wrapper }
    );

    expect(getInput(getByTestId("application-select"))).toBeEnabled();
    expect(getInput(getByTestId("package-type-select"))).toBeEnabled();
    expect(getInput(getByTestId("billing-interval-select"))).toBeEnabled();
    // disabled until Billing Interval is selected
    expect(getInput(getByTestId("expiration-date-select"))).toBeDisabled();
  });

  it("can render multiple draft subscriptions", () => {
    const state = produce(initialState, (draft) => {
      draft.draftSubscriptions.push(draft.draftSubscriptions[0]);
    });
    const { getAllByTestId } = render(
      <SubscriptionBuilder state={state} dispatch={mockDispatch} />,
      { wrapper }
    );

    expect(getAllByTestId("draft-subscription")).toHaveLength(2);
  });

  it("doesn't render delete subscription icon for the first draft subscription", () => {
    const { queryByTestId } = render(
      <SubscriptionBuilder state={initialState} dispatch={mockDispatch} />,
      { wrapper }
    );

    expect(queryByTestId("delete-subscription")).not.toBeInTheDocument();
  });

  it("renders delete subscription icon for all but the first draft subscription", () => {
    const state = produce(initialState, (draft) => {
      draft.draftSubscriptions.push(draft.draftSubscriptions[0]);
    });
    const { getAllByTestId } = render(
      <SubscriptionBuilder state={state} dispatch={mockDispatch} />,
      { wrapper }
    );

    expect(getAllByTestId("delete-subscription")).toHaveLength(1);
  });

  it("disables all draft subscriptions fields if disabled is true", () => {
    const state = produce(initialState, (draft) => {
      draft.draftSubscriptions.push(draft.draftSubscriptions[0]);
    });
    const { getAllByTestId } = render(
      <SubscriptionBuilder disabled state={state} dispatch={mockDispatch} />,
      { wrapper }
    );

    const draftSubscriptions = getAllByTestId("draft-subscription");
    draftSubscriptions.forEach((draft) => {
      const appSelect = within(draft).getByTestId("application-select");
      const packageSelect = within(draft).getByTestId("package-type-select");
      const billingSelect = within(draft).getByTestId("billing-interval-select");
      const expireSelect = within(draft).getByTestId("expiration-date-select");
      expect(getInput(appSelect)).toBeDisabled();
      expect(getInput(packageSelect)).toBeDisabled();
      expect(getInput(billingSelect)).toBeDisabled();
      expect(getInput(expireSelect)).toBeDisabled();
    });
  });

  it("enables Add another subscription if canAddSubscription is true", () => {
    const state = produce(initialState, (draft) => {
      draft.canAddSubscription = true;
    });
    const { getByText } = render(
      <SubscriptionBuilder state={state} dispatch={mockDispatch} />,
      { wrapper }
    );

    expect(getByText("Add another subscription")).toBeEnabled();
  });

  it("disables Add another subscription if canAddSubscription is false", () => {
    const state = produce(initialState, (draft) => {
      draft.canAddSubscription = false;
    });
    const { getByText } = render(
      <SubscriptionBuilder state={state} dispatch={mockDispatch} />,
      { wrapper }
    );

    expect(getByText("Add another subscription")).toBeDisabled();
  });

  it("disables Add another sbuscription if canAddSubscription is true and disabled is true", () => {
    const state = produce(initialState, (draft) => {
      draft.canAddSubscription = true;
    });
    const { getByText } = render(
      <SubscriptionBuilder disabled state={state} dispatch={mockDispatch} />,
      { wrapper }
    );

    expect(getByText("Add another subscription")).toBeDisabled();
  });

  it("disables Add another sbuscription if canAddSubscription is true and loading is true", () => {
    const state = produce(initialState, (draft) => {
      draft.canAddSubscription = true;
    });
    const { getByText } = render(
      <SubscriptionBuilder loading state={state} dispatch={mockDispatch} />,
      { wrapper }
    );

    expect(getByText("Add another subscription")).toBeDisabled();
  });

  it("calls dispatch when Add another subscription is clicked", () => {
    const state = produce(initialState, (draft) => {
      draft.canAddSubscription = true;
    });
    const { getByText } = render(
      <SubscriptionBuilder state={state} dispatch={mockDispatch} />,
      { wrapper }
    );

    fireEvent.click(getByText("Add another subscription"));

    expect(mockDispatch).toHaveBeenCalledWith({ type: "ADD_SUBSCRIPTION" });
  });
});

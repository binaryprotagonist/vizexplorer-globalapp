import { fireEvent, render, within } from "@testing-library/react";
import { DraftSubscription } from "./draft-subscription";
import { DraftSubscriptionState, ReducerAction } from "./reducer";
import { AppId, BillingInterval } from "generated-graphql";
import { ThemeProvider } from "../../../theme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { mockSubBuilderSubPlans } from "./__mocks__/subscription-builder";
import { produce } from "immer";
import { addYears, format, parseISO } from "date-fns";
import { getInput, updateInput } from "testing/utils";

const mockdraftState: DraftSubscriptionState = {
  draftSubscription: {
    appId: null,
    packageType: null,
    billingInterval: null,
    expirationDate: null
  },
  options: {
    applications: [AppId.Sre, AppId.Pdengage, AppId.Floorheatmap],
    billingIntervals: [BillingInterval.Monthly, BillingInterval.Annual],
    packageTypes: ["elite", "premium"],
    minExpireDate: new Date()
  }
};

describe("<DraftSubscription />", () => {
  function wrapper({ children }: any) {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider>{children}</ThemeProvider>;
      </LocalizationProvider>
    );
  }

  it("sorts app options", () => {
    const { getByTestId, getAllByRole } = render(
      <DraftSubscription
        index={0}
        draftState={mockdraftState}
        subPlans={mockSubBuilderSubPlans}
        dispatch={jest.fn()}
      />,
      { wrapper }
    );

    const select = getByTestId("application-select");
    fireEvent.click(within(select).getByRole("button", { name: "Open" }));

    const options = getAllByRole("option");
    expect(options[0]).toHaveTextContent("PD Engage");
    expect(options[1]).toHaveTextContent("Slot Heat Map");
    expect(options[2]).toHaveTextContent("Slot Rec Engine");
  });

  it("doesn't include app options that don't have a corresponding plan", () => {
    const missingPlanState = produce(mockdraftState, (draft) => {
      draft.options.applications.push(AppId.Vizbi);
    });
    const { getByTestId, getAllByRole } = render(
      <DraftSubscription
        index={0}
        draftState={mockdraftState}
        subPlans={mockSubBuilderSubPlans}
        dispatch={jest.fn()}
      />,
      { wrapper }
    );

    const select = getByTestId("application-select");
    fireEvent.click(within(select).getByRole("button", { name: "Open" }));

    const options = getAllByRole("option");
    expect(options).toHaveLength(missingPlanState.options.applications.length - 1);
  });

  it("calls onChange with correct arguments for application", () => {
    const mockDispatch = jest.fn();
    const { getByTestId, getByText } = render(
      <DraftSubscription
        index={0}
        draftState={mockdraftState}
        subPlans={mockSubBuilderSubPlans}
        dispatch={mockDispatch}
      />,
      { wrapper }
    );

    const appSelect = getByTestId("application-select");
    fireEvent.click(within(appSelect).getByRole("button", { name: "Open" }));
    fireEvent.click(getByText("Slot Rec Engine"));

    expect(mockDispatch).toHaveBeenCalledWith<[ReducerAction]>({
      type: "UPDATE_APP",
      payload: {
        subIdx: 0,
        appId: AppId.Sre
      }
    });
  });

  it("renders package type options", () => {
    const { getByTestId, getAllByRole } = render(
      <DraftSubscription
        index={0}
        draftState={mockdraftState}
        subPlans={mockSubBuilderSubPlans}
        dispatch={jest.fn()}
      />,
      { wrapper }
    );

    const packageTypeSelect = getByTestId("package-type-select");
    fireEvent.click(within(packageTypeSelect).getByRole("button", { name: "Open" }));

    const options = getAllByRole("option");
    expect(options[0]).toHaveTextContent("Elite");
    expect(options[1]).toHaveTextContent("Premium");
  });

  it("calls onChange with correct arguments for package-type", () => {
    const mockDispatch = jest.fn();
    const { getByTestId, getByText } = render(
      <DraftSubscription
        index={0}
        draftState={mockdraftState}
        subPlans={mockSubBuilderSubPlans}
        dispatch={mockDispatch}
      />,
      { wrapper }
    );

    const packageTypeSelect = getByTestId("package-type-select");
    fireEvent.click(within(packageTypeSelect).getByRole("button", { name: "Open" }));
    fireEvent.click(getByText("Premium"));

    expect(mockDispatch).toHaveBeenCalledWith<[ReducerAction]>({
      type: "UPDATE_PACKAGE_TYPE",
      payload: { subIdx: 0, packageType: "premium" }
    });
  });

  it("disables package type select if it has a value and there is only one option", () => {
    const packageTypeSelected = produce(mockdraftState, (draft) => {
      draft.draftSubscription.packageType = "elite";
      draft.options.packageTypes = ["elite"];
    });
    const { getByTestId } = render(
      <DraftSubscription
        index={0}
        draftState={packageTypeSelected}
        subPlans={mockSubBuilderSubPlans}
        dispatch={jest.fn()}
      />,
      { wrapper }
    );

    const packageTypeSelect = getByTestId("package-type-select");
    expect(getInput(packageTypeSelect)).toBeDisabled();
  });

  it("renders billing interval options", () => {
    const { getByTestId, getAllByRole } = render(
      <DraftSubscription
        index={0}
        draftState={mockdraftState}
        subPlans={mockSubBuilderSubPlans}
        dispatch={jest.fn()}
      />,
      { wrapper }
    );

    const billingIntervalSelect = getByTestId("billing-interval-select");
    fireEvent.click(within(billingIntervalSelect).getByRole("button", { name: "Open" }));

    const options = getAllByRole("option");
    expect(options[0]).toHaveTextContent("Monthly");
    expect(options[1]).toHaveTextContent("Annual");
  });

  it("calls onChange with correct arguments for billing interval", () => {
    const mockDispatch = jest.fn();
    const { getByTestId, getByText } = render(
      <DraftSubscription
        index={0}
        draftState={mockdraftState}
        subPlans={mockSubBuilderSubPlans}
        dispatch={mockDispatch}
      />,
      { wrapper }
    );

    const billingIntervalSelect = getByTestId("billing-interval-select");
    fireEvent.click(within(billingIntervalSelect).getByRole("button", { name: "Open" }));
    fireEvent.click(getByText("Annual"));

    expect(mockDispatch).toHaveBeenCalledWith<[ReducerAction]>({
      type: "UPDATE_BILLING_INTERVAL",
      payload: { subIdx: 0, billingInterval: BillingInterval.Annual }
    });
  });

  it("disables billing interval select if it has a value and there is only one option", () => {
    const billingIntervalSelected = produce(mockdraftState, (draft) => {
      draft.draftSubscription.billingInterval = BillingInterval.Monthly;
      draft.options.billingIntervals = [BillingInterval.Monthly];
    });
    const { getByTestId } = render(
      <DraftSubscription
        index={0}
        draftState={billingIntervalSelected}
        subPlans={mockSubBuilderSubPlans}
        dispatch={jest.fn()}
      />,
      { wrapper }
    );

    const billingIntervalSelect = getByTestId("billing-interval-select");
    expect(getInput(billingIntervalSelect)).toBeDisabled();
  });

  it("disables expiration date if billing interval is not selected", () => {
    const { getByTestId } = render(
      <DraftSubscription
        index={0}
        draftState={mockdraftState}
        subPlans={mockSubBuilderSubPlans}
        dispatch={jest.fn()}
      />,
      { wrapper }
    );

    const expirationDateSelect = getByTestId("expiration-date-select");
    expect(getInput(expirationDateSelect)).toBeDisabled();
  });

  it("enables expiration date if billing interval is selected", () => {
    const billingIntervalSelected = produce(mockdraftState, (draft) => {
      draft.draftSubscription.billingInterval = BillingInterval.Annual;
    });
    const { getByTestId } = render(
      <DraftSubscription
        index={0}
        draftState={billingIntervalSelected}
        subPlans={mockSubBuilderSubPlans}
        dispatch={jest.fn()}
      />,
      { wrapper }
    );

    const expirationDateSelect = getByTestId("expiration-date-select");
    expect(getInput(expirationDateSelect)).toBeEnabled();
  });

  it("opens date picker to the month and year of the minExpireDate", () => {
    const oneYearLater = addYears(new Date(), 1);
    const minExpireOneYearLater = produce(mockdraftState, (draft) => {
      draft.draftSubscription.billingInterval = BillingInterval.Annual;
      draft.options.minExpireDate = oneYearLater;
    });
    const { getByTestId, getByRole } = render(
      <DraftSubscription
        index={0}
        draftState={minExpireOneYearLater}
        subPlans={mockSubBuilderSubPlans}
        dispatch={jest.fn()}
      />,
      { wrapper }
    );

    const expirationDateSelect = getByTestId("expiration-date-select");
    fireEvent.click(within(expirationDateSelect).getByLabelText("Choose date"));

    const expectedMonthYear = format(oneYearLater, "MMMM yyyy");
    expect(getByRole("dialog")).toHaveTextContent(expectedMonthYear);
  });

  it("runs onChange with correct arguments for expiration date", () => {
    const withBillingInterval = produce(mockdraftState, (draft) => {
      draft.draftSubscription.billingInterval = BillingInterval.Annual;
    });
    const mockDispatch = jest.fn();
    const { getByTestId } = render(
      <DraftSubscription
        index={0}
        draftState={withBillingInterval}
        subPlans={mockSubBuilderSubPlans}
        dispatch={mockDispatch}
      />,
      { wrapper }
    );

    updateInput(getByTestId("expiration-date-select"), "01 January 2022");

    expect(mockDispatch).toHaveBeenCalledWith<[ReducerAction]>({
      type: "UPDATE_EXPIRATION_DATE",
      payload: {
        subIdx: 0,
        expirationDate: parseISO("2022-01-01")
      }
    });
  });

  it("disables all inputs if disabled prop is true", () => {
    const completeDraft = produce(mockdraftState, (draft) => {
      draft.draftSubscription.appId = AppId.Sre;
      draft.draftSubscription.packageType = "elite";
      draft.draftSubscription.billingInterval = BillingInterval.Monthly;
      draft.draftSubscription.expirationDate = new Date();
    });
    const { getByTestId } = render(
      <DraftSubscription
        disabled
        index={0}
        draftState={completeDraft}
        subPlans={mockSubBuilderSubPlans}
        dispatch={jest.fn()}
      />,
      { wrapper }
    );

    expect(getInput(getByTestId("application-select"))).toBeDisabled();
    expect(getInput(getByTestId("package-type-select"))).toBeDisabled();
    expect(getInput(getByTestId("billing-interval-select"))).toBeDisabled();
    expect(getInput(getByTestId("expiration-date-select"))).toBeDisabled();
  });

  it("renders delete subscription button if showDelete is true", () => {
    const { getByTestId } = render(
      <DraftSubscription
        showDelete
        index={0}
        draftState={mockdraftState}
        subPlans={mockSubBuilderSubPlans}
        dispatch={jest.fn()}
      />,
      { wrapper }
    );

    expect(getByTestId("delete-subscription")).toBeInTheDocument();
  });

  it("doesn't render delete subscription button if showDelete is false", () => {
    const { queryByTestId } = render(
      <DraftSubscription
        showDelete={false}
        index={0}
        draftState={mockdraftState}
        subPlans={mockSubBuilderSubPlans}
        dispatch={jest.fn()}
      />,
      { wrapper }
    );

    expect(queryByTestId("delete-subscription")).not.toBeInTheDocument();
  });

  it("calls dispatch with correct arguments when delete button is clicked", () => {
    const mockDispatch = jest.fn();
    const { getByTestId } = render(
      <DraftSubscription
        showDelete
        index={0}
        draftState={mockdraftState}
        subPlans={mockSubBuilderSubPlans}
        dispatch={mockDispatch}
      />,
      { wrapper }
    );

    fireEvent.click(getByTestId("delete-subscription"));

    expect(mockDispatch).toHaveBeenCalledWith<[ReducerAction]>({
      type: "DELETE_SUBSCRIPTION",
      payload: { subIdx: 0 }
    });
  });
});

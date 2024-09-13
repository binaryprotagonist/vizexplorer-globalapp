import { fireEvent, render, within } from "@testing-library/react";
import { AddSubscriptionForm } from "./add-subscription-form";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { ThemeProvider } from "../../../theme";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { getInput, updateInput } from "testing/utils";
import { initialAddSubscriptionReducerState } from "view-v2/subscription/add-subscription/reducer";
import { addYears, format, startOfToday } from "date-fns";
import { mockSubBuilderSubPlans } from "view-v2/subscription/add-subscription/__mocks__/subscription-builder";

const initialFormState = initialAddSubscriptionReducerState();

describe("<AddSubscriptionForm />", () => {
  function wrapper({ children }: any) {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider>{children}</ThemeProvider>;
      </LocalizationProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(
      <AddSubscriptionForm initialFormState={initialFormState} subscriptionPlans={[]} />,
      { wrapper }
    );

    expect(getByTestId("add-subscription-form")).toBeInTheDocument();
  });

  it("calls onSkip when skip is clicked", () => {
    const onSkip = jest.fn();
    const { getByText } = render(
      <AddSubscriptionForm
        initialFormState={initialFormState}
        subscriptionPlans={[]}
        onSkip={onSkip}
      />,
      { wrapper }
    );

    fireEvent.click(getByText("Skip"));

    expect(onSkip).toHaveBeenCalled();
  });

  it("enables save when all draft subscription fields are complete", () => {
    const { getByTestId, getByText } = render(
      <AddSubscriptionForm
        initialFormState={initialFormState}
        subscriptionPlans={mockSubBuilderSubPlans}
      />,
      { wrapper }
    );

    fireEvent.click(within(getByTestId("environment-field")).getByRole("button"));
    fireEvent.click(getByText("On-Premises"));
    fireEvent.click(within(getByTestId("application-select")).getByRole("button"));
    fireEvent.click(getByText("PD Rec Engine"));
    updateInput(
      getByTestId("expiration-date-select"),
      format(addYears(startOfToday(), 1), "dd MMMM yyyy")
    );

    expect(getByTestId("save-button")).toBeEnabled();
  });

  it("calls onSubmit when save is clicked", () => {
    const onSubmit = jest.fn();
    const { getByText, getByTestId } = render(
      <AddSubscriptionForm
        initialFormState={initialFormState}
        subscriptionPlans={mockSubBuilderSubPlans}
        onSubmit={onSubmit}
      />,
      { wrapper }
    );

    fireEvent.click(within(getByTestId("environment-field")).getByRole("button"));
    fireEvent.click(getByText("On-Premises"));
    fireEvent.click(within(getByTestId("application-select")).getByRole("button"));
    fireEvent.click(getByText("PD Rec Engine"));
    updateInput(
      getByTestId("expiration-date-select"),
      format(addYears(startOfToday(), 1), "dd MMMM yyyy")
    );

    fireEvent.click(getByText("Save"));

    expect(onSubmit).toHaveBeenCalled();
  });

  it("disables all but the Skip button if loading is true", () => {
    const { getByText, getByTestId } = render(
      <AddSubscriptionForm
        loading
        initialFormState={initialFormState}
        subscriptionPlans={[]}
      />,
      { wrapper }
    );

    expect(getInput(getByTestId("environment-field"))).toBeDisabled();
    expect(getInput(getByTestId("application-select"))).toBeDisabled();
    expect(getInput(getByTestId("billing-interval-select"))).toBeDisabled();
    expect(getInput(getByTestId("package-type-select"))).toBeDisabled();
    expect(getByText("Add another subscription")).toBeDisabled();
    expect(getByText("Skip")).toBeEnabled();
    expect(getByTestId("save-button")).toBeDisabled();
    expect(getByTestId("save-button")).toHaveTextContent("Save");
  });

  it("disables all fields and actions if saving is true", () => {
    const { getByText, getByTestId } = render(
      <AddSubscriptionForm
        saving
        initialFormState={initialFormState}
        subscriptionPlans={[]}
      />,
      { wrapper }
    );

    expect(getInput(getByTestId("environment-field"))).toBeDisabled();
    expect(getInput(getByTestId("application-select"))).toBeDisabled();
    expect(getInput(getByTestId("billing-interval-select"))).toBeDisabled();
    expect(getInput(getByTestId("package-type-select"))).toBeDisabled();
    expect(getByText("Add another subscription")).toBeDisabled();
    expect(getByText("Skip")).toBeDisabled();
    expect(getByTestId("save-button")).toBeDisabled();
    expect(getByTestId("save-button")).toBeEmptyDOMElement();
  });
});

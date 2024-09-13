import { fireEvent, render } from "@testing-library/react";
import { ThemeProvider } from "../../../../../theme";
import { SubscriptionFormFields } from "./subscription-form-fields";
import { fixtEmptyForm, fixtSreForm, generateDummyFormOptions } from "./__fixtures__";
import { FormOptions } from "./types";
import { AppId, BillingInterval } from "generated-graphql";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { getInput } from "testing/utils";
import { format } from "date-fns";
import { mockSubscriptionPlans } from "testing/mocks/admin";
import { Environment } from "../../types";

const mockFormOptions: FormOptions = generateDummyFormOptions(
  AppId.Sre,
  mockSubscriptionPlans
);
const origMatchMedia = window.matchMedia;

function wrapper({ children }: any) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider>{children}</ThemeProvider>
    </LocalizationProvider>
  );
}

describe("<SubscriptionFormFields />", () => {
  const mockOnChange = jest.fn();

  beforeAll(() => {
    // ensure date picker is rendered in desktop mode.
    window.matchMedia = jest.fn(() => ({
      matches: true,
      addListener: jest.fn(),
      removeListener: jest.fn()
    })) as any;
  });

  beforeEach(() => {
    mockOnChange.mockReset();
  });

  afterAll(() => {
    window.matchMedia = origMatchMedia;
  });

  it("renders form fields", () => {
    const { getByTestId } = render(
      <SubscriptionFormFields
        state={fixtSreForm}
        options={mockFormOptions}
        onChange={mockOnChange}
        disabled={false}
      />,
      { wrapper }
    );

    expect(getByTestId("application-field")).toBeInTheDocument();
    expect(getByTestId("environment-field")).toBeInTheDocument();
    expect(getByTestId("billing-interval-field")).toBeInTheDocument();
    expect(getByTestId("package-type-field")).toBeInTheDocument();
    expect(getByTestId("expire-date-field")).toBeInTheDocument();
  });

  it("renders fields enabled if `disabled` is false", () => {
    const { getByTestId } = render(
      <SubscriptionFormFields
        state={fixtSreForm}
        options={mockFormOptions}
        onChange={mockOnChange}
        disabled={false}
      />,
      { wrapper }
    );

    expect(getInput(getByTestId("application-field"))).toBeEnabled();
    expect(getInput(getByTestId("environment-field"))).toBeEnabled();
    expect(getInput(getByTestId("billing-interval-field"))).toBeEnabled();
    expect(getInput(getByTestId("package-type-field"))).toBeEnabled();
  });

  it("renders fields disabled if `disabled` is true", () => {
    const { getByTestId } = render(
      <SubscriptionFormFields
        state={fixtSreForm}
        options={mockFormOptions}
        onChange={mockOnChange}
        disabled={true}
      />,
      { wrapper }
    );

    expect(getInput(getByTestId("application-field"))).toBeDisabled();
    expect(getInput(getByTestId("environment-field"))).toBeDisabled();
    expect(getInput(getByTestId("billing-interval-field"))).toBeDisabled();
    expect(getInput(getByTestId("package-type-field"))).toBeDisabled();
  });

  it("renders Expire Date as disabled by default", () => {
    const { getByTestId } = render(
      <SubscriptionFormFields
        state={fixtEmptyForm}
        options={mockFormOptions}
        onChange={mockOnChange}
        disabled={false}
      />,
      { wrapper }
    );

    expect(getInput(getByTestId("expire-date-field"))).toBeDisabled();
  });

  it("enables Expire Date when Billing Interval is not null", () => {
    const { getByTestId } = render(
      <SubscriptionFormFields
        state={fixtSreForm}
        options={mockFormOptions}
        onChange={mockOnChange}
        disabled={false}
      />,
      { wrapper }
    );

    expect(getInput(getByTestId("expire-date-field"))).toBeEnabled();
  });

  it("renders Expire Date as disabled if `disabled` is true and a billing interval is not null", () => {
    const { getByTestId } = render(
      <SubscriptionFormFields
        state={fixtSreForm}
        options={mockFormOptions}
        onChange={mockOnChange}
        disabled={true}
      />,
      { wrapper }
    );

    expect(getInput(getByTestId("expire-date-field"))).toBeDisabled();
  });

  it("renders selected provided form values", () => {
    const { getByTestId } = render(
      <SubscriptionFormFields
        state={fixtSreForm}
        options={mockFormOptions}
        onChange={mockOnChange}
        disabled={false}
      />,
      { wrapper }
    );

    const appInput = getInput(getByTestId("application-field"));
    const envInput = getInput(getByTestId("environment-field"));
    const billingInput = getInput(getByTestId("billing-interval-field"));
    const packageInput = getInput(getByTestId("package-type-field"));
    const expireInput = getInput(getByTestId("expire-date-field"));

    expect(appInput).toHaveValue("Slot Recommendation Engine");
    expect(envInput).toHaveValue("Cloud");
    expect(billingInput).toHaveValue("Annual");
    expect(packageInput).toHaveValue("Premium");
    expect(expireInput).toHaveValue(format(fixtSreForm.expirationDate!, "MM/dd/yyyy"));
  });

  it("runs `onChange` when Application is changed", () => {
    const { getByTestId, getByText } = render(
      <SubscriptionFormFields
        state={fixtEmptyForm}
        options={mockFormOptions}
        onChange={mockOnChange}
        disabled={false}
      />,
      { wrapper }
    );

    fireEvent.keyDown(getByTestId("application-field"), { key: "ArrowDown" });
    fireEvent.click(getByText("Slot Recommendation Engine"));

    expect(mockOnChange).toHaveBeenCalledWith({
      field: "application",
      value: AppId.Sre
    });
  });

  it("runs `onChange` when Environment is changed", () => {
    const { getByTestId, getByText } = render(
      <SubscriptionFormFields
        state={fixtEmptyForm}
        options={mockFormOptions}
        onChange={mockOnChange}
        disabled={false}
      />,
      { wrapper }
    );

    fireEvent.keyDown(getByTestId("environment-field"), { key: "ArrowDown" });
    fireEvent.click(getByText("Cloud"));

    expect(mockOnChange).toHaveBeenCalledWith({
      field: "environment",
      value: Environment.CLOUD
    });
  });

  it("runs `onChange` when Billing Interval is changed", () => {
    const { getByTestId, getByText } = render(
      <SubscriptionFormFields
        state={fixtEmptyForm}
        options={mockFormOptions}
        onChange={mockOnChange}
        disabled={false}
      />,
      { wrapper }
    );

    fireEvent.keyDown(getByTestId("billing-interval-field"), {
      key: "ArrowDown"
    });
    fireEvent.click(getByText("Annual"));

    expect(mockOnChange).toHaveBeenCalledWith({
      field: "billing-interval",
      value: BillingInterval.Annual
    });
  });

  it("runs `onChange` when Package Type is changed", () => {
    const { getByTestId, getByText } = render(
      <SubscriptionFormFields
        state={fixtEmptyForm}
        options={mockFormOptions}
        onChange={mockOnChange}
        disabled={false}
      />,
      { wrapper }
    );

    fireEvent.keyDown(getByTestId("package-type-field"), { key: "ArrowDown" });
    fireEvent.click(getByText("Premium"));

    expect(mockOnChange).toHaveBeenCalledWith({
      field: "package-type",
      value: "premium"
    });
  });

  it("runs `onChange` when Package Type is changed", () => {
    const { getByTestId, getByText } = render(
      <SubscriptionFormFields
        state={fixtEmptyForm}
        options={mockFormOptions}
        onChange={mockOnChange}
        disabled={false}
      />,
      { wrapper }
    );

    fireEvent.keyDown(getByTestId("package-type-field"), { key: "ArrowDown" });
    fireEvent.click(getByText("Premium"));

    expect(mockOnChange).toHaveBeenCalledWith({
      field: "package-type",
      value: "premium"
    });
  });
});

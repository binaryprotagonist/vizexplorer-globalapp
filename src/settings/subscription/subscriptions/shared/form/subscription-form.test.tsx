import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { fireEvent, render } from "@testing-library/react";
import { ThemeProvider } from "../../../../../theme";
import { SubscriptionForm } from "./subscription-form";
import { fixtEmptyForm, fixtSreForm, generateDummyFormOptions } from "./__fixtures__";
import { FormOptions } from "./types";
import { AppId } from "generated-graphql";
import { getInput } from "testing/utils";
import { mockSubscriptionPlans } from "testing/mocks/admin";

const mockFormOptions: FormOptions = generateDummyFormOptions(
  AppId.Sre,
  mockSubscriptionPlans
);

function wrapper({ children }: any) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider>{children}</ThemeProvider>
    </LocalizationProvider>
  );
}

describe("<SubscriptionForm />", () => {
  const mockOnChange = jest.fn();
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    mockOnChange.mockReset();
    mockOnSubmit.mockReset();
    mockOnCancel.mockReset();
  });

  it("renders", () => {
    const { getByTestId } = render(
      <SubscriptionForm
        state={fixtSreForm}
        options={mockFormOptions}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        loading={false}
        disabled={false}
      />,
      { wrapper }
    );

    expect(getByTestId("subscription-form")).toBeInTheDocument();
  });

  it("renders form fields", () => {
    const { getByTestId } = render(
      <SubscriptionForm
        state={fixtSreForm}
        options={mockFormOptions}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        loading={false}
        disabled={false}
      />,
      { wrapper }
    );

    expect(getByTestId("application-field")).toBeInTheDocument();
  });

  it("renders loading form if `loading` is true", () => {
    const { getByTestId, queryByText } = render(
      <SubscriptionForm
        state={fixtSreForm}
        options={mockFormOptions}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        loading={true}
        disabled={false}
      />,
      { wrapper }
    );

    expect(getByTestId("subscription-form-loading")).toBeInTheDocument();
    expect(queryByText("subscription-form")).not.toBeInTheDocument();
  });

  it("disables form fields and actions if `disabled` is true", () => {
    const { getByTestId } = render(
      <SubscriptionForm
        state={fixtSreForm}
        options={mockFormOptions}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        loading={false}
        disabled={true}
      />,
      { wrapper }
    );

    expect(getInput(getByTestId("application-field"))).toBeDisabled();
    expect(getByTestId("submit-btn")).toBeDisabled();
    expect(getByTestId("cancel-btn")).toBeDisabled();
  });

  it("runs `onChange` if a form field is changed", () => {
    const { getByTestId, getByText } = render(
      <SubscriptionForm
        state={fixtEmptyForm}
        options={mockFormOptions}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        loading={false}
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

  it("runs `onCancel` if Cancel is clicked", () => {
    const { getByTestId } = render(
      <SubscriptionForm
        state={fixtEmptyForm}
        options={mockFormOptions}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        loading={false}
        disabled={false}
      />,
      { wrapper }
    );

    fireEvent.click(getByTestId("cancel-btn"));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("runs `onSubmit` if Submit is clicked", () => {
    const { getByTestId } = render(
      <SubscriptionForm
        state={fixtSreForm}
        options={mockFormOptions}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        loading={false}
        disabled={false}
      />,
      { wrapper }
    );

    fireEvent.click(getByTestId("submit-btn"));
    expect(mockOnSubmit).toHaveBeenCalledWith(fixtSreForm, mockFormOptions);
  });
});

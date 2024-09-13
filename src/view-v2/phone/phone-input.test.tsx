import { fireEvent, render, waitFor } from "@testing-library/react";
import PhoneInput from "./phone-input";
import { updateInput } from "testing/utils";

describe("<PhoneInput />", () => {
  it("renders", () => {
    const { getByTestId } = render(<PhoneInput />);

    expect(getByTestId("phone-input")).toBeInTheDocument();
  });

  it("defaults country selection to US", () => {
    const { getByLabelText } = render(<PhoneInput />);

    expect(getByLabelText("Selected country")).toHaveAttribute("title", "United States");
  });

  it("can override default country selection", () => {
    const { getByLabelText } = render(
      <PhoneInput initOptions={{ initialCountry: "nz" }} />
    );

    expect(getByLabelText("Selected country")).toHaveAttribute("title", "New Zealand");
  });

  it("calls onChangeCountry when country is changed", () => {
    const onChangeCountry = jest.fn();
    const { getByText, getByLabelText } = render(
      <PhoneInput onChangeCountry={onChangeCountry} />
    );

    fireEvent.click(getByLabelText("Selected country"));
    fireEvent.click(getByText("Afghanistan"));

    expect(onChangeCountry).toHaveBeenCalledWith("af");
  });

  it("calls onChangeNumber when phone number is changed", async () => {
    const onChangeNumber = jest.fn();
    const { getByLabelText } = render(<PhoneInput onChangeNumber={onChangeNumber} />);

    updateInput(getByLabelText("Phone number"), "123");

    // number changes appear to be attached to a promise - wait for the promise to resolve
    await waitFor(() => {});
    expect(onChangeNumber).toHaveBeenCalledWith("+1123");
  });

  it("calls onChangeValidity with true for a valid NZ mobile", async () => {
    const onChangeValidity = jest.fn();
    const { getByLabelText } = render(
      <PhoneInput
        initOptions={{ initialCountry: "nz" }}
        onChangeValidity={onChangeValidity}
      />
    );

    updateInput(getByLabelText("Phone number"), "0212345678");

    await waitFor(() => {});
    expect(onChangeValidity).toHaveBeenCalledWith(true);
  });

  it("calls onChangeValidity with false for a invalid NZ number", async () => {
    const onChangeValidity = jest.fn();
    const { getByLabelText } = render(
      <PhoneInput
        initOptions={{ initialCountry: "nz" }}
        onChangeValidity={onChangeValidity}
      />
    );

    updateInput(getByLabelText("Phone number"), "0212345");

    await waitFor(() => {});
    expect(onChangeValidity).toHaveBeenCalledWith(false);
  });

  it("renders helper text if provided", () => {
    const { getByText } = render(<PhoneInput helperText={"Test helper text"} />);

    expect(getByText("Test helper text")).toBeInTheDocument();
  });

  it("assigns error class if error prop is true", () => {
    const { getByLabelText, rerender } = render(<PhoneInput />);

    expect(getByLabelText("Phone number")).not.toHaveClass("iti__custom_error");

    rerender(<PhoneInput error />);

    expect(getByLabelText("Phone number")).toHaveClass("iti__custom_error");
  });

  it("removes error class if error prop is false", () => {
    const { getByLabelText, rerender } = render(<PhoneInput error />);

    expect(getByLabelText("Phone number")).toHaveClass("iti__custom_error");

    rerender(<PhoneInput />);

    expect(getByLabelText("Phone number")).not.toHaveClass("iti__custom_error");
  });

  it("assigns disabled class if inputProps.disabled is true", () => {
    const { getByTestId, rerender } = render(<PhoneInput />);

    expect(getByTestId("phone-input")).not.toHaveClass("iti__custom_disabled");

    rerender(<PhoneInput inputProps={{ disabled: true }} />);

    expect(getByTestId("phone-input")).toHaveClass("iti__custom_disabled");
  });

  it("removes disabled class if inputProps.disabled is false", () => {
    const { getByTestId, rerender } = render(
      <PhoneInput inputProps={{ disabled: true }} />
    );

    expect(getByTestId("phone-input")).toHaveClass("iti__custom_disabled");

    rerender(<PhoneInput />);

    expect(getByTestId("phone-input")).not.toHaveClass("iti__custom_disabled");
  });
});

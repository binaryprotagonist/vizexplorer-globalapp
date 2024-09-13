import { fireEvent, render, within } from "@testing-library/react";
import { EnvironmentField } from "./environment-field";
import { SubscriptionEnvironment } from "../types";
import { getInput } from "testing/utils";

describe("<EnvironmentField />", () => {
  it("renders", () => {
    const { getByTestId } = render(<EnvironmentField options={[]} onChange={() => {}} />);

    expect(getByTestId("environment")).toBeInTheDocument();
  });

  it("renders selected environment", () => {
    const { getByTestId } = render(
      <EnvironmentField
        selected={SubscriptionEnvironment.CLOUD}
        options={[SubscriptionEnvironment.CLOUD, SubscriptionEnvironment.ONPREM]}
        onChange={() => {}}
      />
    );

    expect(getInput(getByTestId("environment-field"))).toHaveValue("Cloud");
  });

  it("renders expected placeholder when selected is null", () => {
    const { getByPlaceholderText } = render(
      <EnvironmentField
        selected={null}
        options={[SubscriptionEnvironment.CLOUD, SubscriptionEnvironment.ONPREM]}
        onChange={() => {}}
      />
    );

    expect(getByPlaceholderText("Select installation environment")).toBeInTheDocument();
  });

  it("disables the input when disabled is true", () => {
    const { getByTestId } = render(
      <EnvironmentField
        disabled
        selected={SubscriptionEnvironment.CLOUD}
        options={[SubscriptionEnvironment.CLOUD, SubscriptionEnvironment.ONPREM]}
        onChange={() => {}}
      />
    );

    expect(getInput(getByTestId("environment-field"))).toBeDisabled();
  });

  it("runs onChange when environment changes", () => {
    const onChange = jest.fn();
    const { getByTestId, getByText } = render(
      <EnvironmentField
        selected={SubscriptionEnvironment.CLOUD}
        options={[SubscriptionEnvironment.CLOUD, SubscriptionEnvironment.ONPREM]}
        onChange={onChange}
      />
    );

    fireEvent.click(within(getByTestId("environment-field")).getByRole("button"));
    fireEvent.click(getByText("On-Premises"));

    expect(onChange).toHaveBeenCalledWith(SubscriptionEnvironment.ONPREM);
  });
});

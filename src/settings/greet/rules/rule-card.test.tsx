import { fireEvent, render } from "@testing-library/react";
import { ThemeProvider } from "../../../theme";
import { RuleCard } from "./rule-card";
import { mockGreetRuleWithMultiselectedOptions } from "testing/mocks";

const mockRule = mockGreetRuleWithMultiselectedOptions;

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("<RuleCard />", () => {
  it("renders", () => {
    const { getByTestId } = render(
      <RuleCard
        rule={mockRule}
        order={1}
        expanded={false}
        onClickAction={() => {}}
        loading={false}
      />,
      { wrapper }
    );

    expect(getByTestId("rule-card")).toBeInTheDocument();
  });

  it("renders Rule Name if loading is false", () => {
    const { getByText } = render(
      <RuleCard
        rule={mockRule}
        order={1}
        expanded={false}
        onClickAction={() => {}}
        loading={false}
      />,
      { wrapper }
    );

    expect(getByText(mockRule.name)).toBeInTheDocument();
  });

  it("doesn't render Rule Name if loading is true", () => {
    const { getByTestId, queryByText } = render(<RuleCard order={1} loading={true} />, {
      wrapper
    });

    expect(getByTestId("name-skeleton")).toBeInTheDocument();
    expect(queryByText(mockRule.name)).not.toBeInTheDocument();
  });

  it("enables actions if loading is false", () => {
    const { getByTestId } = render(
      <RuleCard
        rule={mockRule}
        order={1}
        expanded={false}
        onClickAction={() => {}}
        loading={false}
      />,
      { wrapper }
    );

    expect(getByTestId("rule-order")).toHaveStyle({ color: "rgb(27, 92, 169)" });
    expect(getByTestId("edit-rule")).not.toBeDisabled();
    expect(getByTestId("delete-rule")).not.toBeDisabled();
    expect(getByTestId("expand-rule")).not.toBeDisabled();
  });

  it("disables actions if loading is true", () => {
    const { getByTestId } = render(<RuleCard order={1} loading={true} />, { wrapper });

    expect(getByTestId("rule-order")).toHaveStyle({ color: "rgb(52, 64, 84)" });
    expect(getByTestId("edit-rule")).toBeDisabled();
    expect(getByTestId("delete-rule")).toBeDisabled();
    expect(getByTestId("expand-rule")).toBeDisabled();
  });

  it("renders provided order", () => {
    const { getByTestId } = render(
      <RuleCard
        rule={mockRule}
        order={10}
        expanded={false}
        onClickAction={() => {}}
        loading={false}
      />,
      { wrapper }
    );

    expect(getByTestId("rule-order")).toHaveTextContent("Order 10");
  });

  it("doesn't render order tag if order is null", () => {
    const { queryByTestId } = render(
      <RuleCard
        rule={mockRule}
        order={null}
        expanded={false}
        onClickAction={() => {}}
        loading={false}
      />,
      { wrapper }
    );

    expect(queryByTestId("rule-order")).not.toBeInTheDocument();
  });

  it("renders Rule Detail if expanded is true", () => {
    const { getByTestId } = render(
      <RuleCard
        rule={mockRule}
        order={1}
        expanded={true}
        onClickAction={() => {}}
        loading={false}
      />,
      { wrapper }
    );

    expect(getByTestId("rule-detail")).toBeInTheDocument();
  });

  it("doesn't render Rule Detail if expanded is false", () => {
    const { queryByTestId } = render(
      <RuleCard
        rule={mockRule}
        order={1}
        expanded={false}
        onClickAction={() => {}}
        loading={false}
      />,
      { wrapper }
    );

    expect(queryByTestId("rule-detail")).not.toBeInTheDocument();
  });

  it("runs onClickAction when Edit button is clicked", () => {
    const onClickAction = jest.fn();
    const { getByTestId } = render(
      <RuleCard
        rule={mockRule}
        order={1}
        expanded={false}
        onClickAction={onClickAction}
        loading={false}
      />,
      { wrapper }
    );

    fireEvent.click(getByTestId("edit-rule"));
    expect(onClickAction).toHaveBeenCalledWith("edit", mockRule);
  });

  it("runs onClickAction when Delete button is clicked", () => {
    const onClickAction = jest.fn();
    const { getByTestId } = render(
      <RuleCard
        rule={mockRule}
        order={1}
        expanded={false}
        onClickAction={onClickAction}
        loading={false}
      />,
      { wrapper }
    );

    fireEvent.click(getByTestId("delete-rule"));
    expect(onClickAction).toHaveBeenCalledWith("delete", mockRule);
  });

  it("runs onClickAction when Expand button is clicked", () => {
    const onClickAction = jest.fn();
    const { getByTestId } = render(
      <RuleCard
        rule={mockRule}
        order={1}
        expanded={false}
        onClickAction={onClickAction}
        loading={false}
      />,
      { wrapper }
    );

    fireEvent.click(getByTestId("expand-rule"));
    expect(onClickAction).toHaveBeenCalledWith("expand-collapse", mockRule);
  });
});

import { fireEvent, render, waitFor } from "@testing-library/react";
import { ManagePdreRuleDialog } from "./manage-rule-dialog";
import {
  generateDummyPdreRules,
  mockPdreRuleConfigUpdate
} from "../../../../view/testing/mocks";
import { RecoilRoot } from "recoil";
import { MockAuthProvider } from "@vizexplorer/global-ui-core";
import { getInput, MockedProvider } from "../../../../view/testing";
import { ThemeProvider } from "../../../../theme";
import { PdreRuleFragment } from "generated-graphql";
import { produce } from "immer";
import { InMemoryCache } from "@apollo/client";
import { cacheConfig } from "../../../../view/graphql";

describe("<ManagePdreRuleDialog />", () => {
  const rule = generateDummyPdreRules(1)[0];
  let updatedRule: PdreRuleFragment = null as any;
  const cache = new InMemoryCache(cacheConfig);

  beforeEach(() => {
    cache.restore({});
    updatedRule = { ...rule };
  });

  function wrapper({ children }: any) {
    return (
      <RecoilRoot>
        <MockAuthProvider>
          <MockedProvider cache={cache} mocks={[mockPdreRuleConfigUpdate(updatedRule)]}>
            <ThemeProvider>{children}</ThemeProvider>
          </MockedProvider>
        </MockAuthProvider>
      </RecoilRoot>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(
      <ManagePdreRuleDialog rule={rule} onClose={() => {}} />,
      { wrapper }
    );

    expect(getByTestId("pdre-rule-edit-dialog")).toBeInTheDocument();
  });

  it("renders as Enabled if the provided rule is enabled", () => {
    const { getByTestId } = render(
      <ManagePdreRuleDialog rule={rule} onClose={() => {}} />,
      { wrapper }
    );

    const switchInput = getInput(getByTestId("pdre-rule-enabled-switch"));
    expect(switchInput).toBeChecked();
  });

  it("renders as Disabled if the provided rule is disabled", () => {
    const disabledRule = produce(rule, (draft) => {
      draft.config!.enabled = false;
    });
    const { getByTestId } = render(
      <ManagePdreRuleDialog rule={disabledRule} onClose={() => {}} />,
      { wrapper }
    );

    const switchInput = getInput(getByTestId("pdre-rule-enabled-switch"));
    expect(switchInput).not.toBeChecked();
  });

  it("renders provided rule weight", () => {
    const { getByTestId } = render(
      <ManagePdreRuleDialog rule={rule} onClose={() => {}} />,
      { wrapper }
    );

    const weightInput = getInput(getByTestId("pdre-rule-weight"));
    expect(weightInput).toHaveAttribute("value", `${rule.config!.weight}`);
  });

  it("allows changing Enabled state", () => {
    const { getByTestId } = render(
      <ManagePdreRuleDialog rule={rule} onClose={() => {}} />,
      { wrapper }
    );

    const switchInput = getInput(getByTestId("pdre-rule-enabled-switch"));
    expect(switchInput).toBeChecked();

    fireEvent.click(getByTestId("pdre-rule-enabled-switch"));
    expect(switchInput).not.toBeChecked();
  });

  it("displays an error if weight is less than 1", () => {
    const onClose = jest.fn();
    const { getByTestId, getByText } = render(
      <ManagePdreRuleDialog rule={rule} onClose={onClose} />,
      { wrapper }
    );

    const weightInput = getInput(getByTestId("pdre-rule-weight"));
    fireEvent.change(weightInput!, { target: { value: 0 } });
    expect(getByText("Rule Weight must be between 1 and 100")).toBeInTheDocument();
  });

  it("displays an error if weight is greater than 100", () => {
    const onClose = jest.fn();
    const { getByTestId, getByText } = render(
      <ManagePdreRuleDialog rule={rule} onClose={onClose} />,
      { wrapper }
    );

    const weightInput = getInput(getByTestId("pdre-rule-weight"));
    fireEvent.change(weightInput!, { target: { value: 101 } });
    expect(getByText("Rule Weight must be between 1 and 100")).toBeInTheDocument();
  });

  it("can update rule config", async () => {
    // Expected post-change rule state
    updatedRule = produce(rule, (draft) => {
      draft.config!.enabled = false;
      draft.config!.weight = 30;
    });
    const onClose = jest.fn();
    const cacheId = cache.identify(rule.config!)!;
    cache.restore({ [cacheId]: rule.config! });
    const { getByTestId, getByText } = render(
      <ManagePdreRuleDialog rule={rule} onClose={onClose} />,
      { wrapper }
    );

    // Validate rule in cache prior to any changes
    let cachedConfig = cache.extract()[cacheId] as PdreRuleFragment["config"];
    expect(cachedConfig!.enabled).toBeTruthy();
    expect(cachedConfig!.weight).toEqual(10);

    // Update Rule config & Save
    fireEvent.click(getByTestId("pdre-rule-enabled-switch")); // disable rule
    const weightInput = getInput(getByTestId("pdre-rule-weight"));
    fireEvent.change(weightInput!, { target: { value: 30 } }); // change rule weight
    fireEvent.click(getByText("Save"));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
    // Validate rule cache is updated and onClose is called
    cachedConfig = cache.extract()[cacheId] as PdreRuleFragment["config"];
    expect(cachedConfig!.enabled).toBeFalsy();
    expect(cachedConfig!.weight).toEqual(30);
  });
});

import { fireEvent, render } from "@testing-library/react";
import { MultiPropertySwitch } from "./multi-property";
import { RecoilRoot } from "recoil";
import { MockedProvider } from "testing/graphql-provider";
import { OrgFeatures } from "generated-graphql";
import { ThemeProvider } from "../../../theme";
import { getInput } from "testing/utils";
import { mockOrgFeaturesUpdateMutation } from "testing/mocks/admin";

describe("<MultiPropertySwitch />", () => {
  let orgFeaturesUpdate: OrgFeatures = null as any;

  beforeEach(() => {
    orgFeaturesUpdate = {
      multiProperties: false
    };
  });

  function wrapper({ children }: any) {
    return (
      <RecoilRoot>
        <MockedProvider mocks={[mockOrgFeaturesUpdateMutation(orgFeaturesUpdate)]}>
          <ThemeProvider>{children}</ThemeProvider>
        </MockedProvider>
      </RecoilRoot>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(<MultiPropertySwitch enabled />, {
      wrapper
    });

    expect(getByTestId("multi-property-switch"));
  });

  it("sets switch state to `true` if the enabled is `true`", async () => {
    const { getByTestId } = render(<MultiPropertySwitch enabled />, {
      wrapper
    });

    expect(getInput(getByTestId("multi-property-switch"))).toBeChecked();
  });

  it("sets switch state to `false` if the enabled is `false`", async () => {
    const { getByTestId } = render(<MultiPropertySwitch enabled={false} />, {
      wrapper
    });

    expect(getInput(getByTestId("multi-property-switch"))).not.toBeChecked();
  });

  it("changes switch state when clicked", async () => {
    const { getByTestId } = render(<MultiPropertySwitch enabled />, {
      wrapper
    });

    const switchInput = getInput(getByTestId("multi-property-switch"));
    expect(switchInput).toBeChecked();

    fireEvent.click(switchInput!);
    expect(switchInput).not.toBeChecked();
  });
});

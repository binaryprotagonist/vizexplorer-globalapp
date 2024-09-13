import { ThemeProvider } from "../../../../theme";
import { ManageLicense } from "./manage-license";
import { render } from "@testing-library/react";
import { MockAuthProvider } from "@vizexplorer/global-ui-core";
import { RecoilRoot } from "recoil";
import { MockedProvider } from "../../../../view/testing";
import { createMemoryHistory, History } from "history";
import { Router } from "react-router-dom";
import { MockLicenseQueryOpts, mockLicenseQuery } from "./__mocks__/manage-license";

describe("<ManageLicense />", () => {
  let history: History = null as any;
  let licenseOpts: MockLicenseQueryOpts;

  beforeEach(() => {
    history = createMemoryHistory();
    licenseOpts = { status: { isValid: false } };
  });

  function wrapper({ children }: any) {
    return (
      <RecoilRoot>
        <MockAuthProvider>
          <MockedProvider mocks={[mockLicenseQuery(licenseOpts)]}>
            <ThemeProvider>
              <Router navigator={history} location={history.location}>
                {children}
              </Router>
            </ThemeProvider>
          </MockedProvider>
        </MockAuthProvider>
      </RecoilRoot>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(<ManageLicense />, { wrapper });

    expect(getByTestId("manage-license")).toBeInTheDocument();
  });

  it("renders Manage License Card", async () => {
    const { findByTestId } = render(<ManageLicense />, { wrapper });

    await findByTestId("manage-license-card");
  });
});

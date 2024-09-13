import { render } from "@testing-library/react";
import { Unauthorized } from "./unauthorized";
import { GlobalMockedProvider } from "../view/testing";
import { RecoilRoot } from "recoil";
import { MockAuthProvider } from "@vizexplorer/global-ui-core";
import { ThemeProvider } from "../theme";
import { mockCompany, mockCompanyQuery } from "testing/mocks";
import { GaCompanyFragment } from "generated-graphql";

describe("<Unauthorized />", () => {
  let isOnprem = false;
  let company: GaCompanyFragment;

  beforeEach(() => {
    isOnprem = false;
    company = { ...mockCompany };
  });

  function wrapper({ children }: any) {
    return (
      <RecoilRoot>
        <MockAuthProvider>
          <GlobalMockedProvider
            mockData={{ isOnprem }}
            mocks={[mockCompanyQuery(company)]}
          >
            <ThemeProvider>{children}</ThemeProvider>
          </GlobalMockedProvider>
        </MockAuthProvider>
      </RecoilRoot>
    );
  }

  it("renders", async () => {
    const { findByTestId } = render(<Unauthorized />, { wrapper });

    await findByTestId("unauthorized");
  });

  it("renders company name", async () => {
    const { findByText } = render(<Unauthorized />, { wrapper });

    await findByText(company.name);
  });

  it("renders expected messaging for Cloud", async () => {
    const { getByText, findByText } = render(<Unauthorized />, { wrapper });

    await findByText("Unauthorized Cloud Access");
    expect(
      getByText("This account doesn't have access to the requested Cloud resources", {
        exact: false
      })
    ).toBeInTheDocument();
  });

  it("renders expected messaging for OnPrem", async () => {
    isOnprem = true;
    const { getByText, findByText } = render(<Unauthorized />, { wrapper });

    await findByText("Unauthorized On-Premises Access");
    expect(
      getByText(
        "This account doesn't have access to the requested On-Premises resources",
        { exact: false }
      )
    ).toBeInTheDocument();
  });
});

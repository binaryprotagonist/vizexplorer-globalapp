import { render, waitFor } from "@testing-library/react";
import { ThemeProvider } from "../../../theme";
import { createMemoryHistory, History } from "history";
import { Router } from "react-router-dom";
import { ManagePaymentInfo } from ".";
import { MockAuthProvider } from "@vizexplorer/global-ui-core";
import { RecoilRoot } from "recoil";
import { getInput, MockedProvider } from "../../../view/testing";
import {
  mockAdmin,
  mockCompany,
  mockCompanyQuery,
  mockCurrentUserQuery,
  mockOrgAdmin,
  mockViewer
} from "../../../view/testing/mocks";
import { getCountryByCode } from "../../../view/utils/country";
import { GaCompanyFragment, GaUserFragment } from "generated-graphql";

describe("<ManagePaymentInfo />", () => {
  let history: History = null as any;
  let currentUser: GaUserFragment = null as any;
  let company: GaCompanyFragment = null as any;

  beforeEach(() => {
    company = { ...mockCompany };
    currentUser = { ...mockOrgAdmin };
    history = createMemoryHistory();
  });

  function wrapper({ children }: any) {
    return (
      <RecoilRoot>
        <MockAuthProvider>
          <MockedProvider
            mocks={[mockCurrentUserQuery(currentUser), mockCompanyQuery(company)]}
          >
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

  it("renders", async () => {
    const { findByTestId } = render(<ManagePaymentInfo />, { wrapper });

    await findByTestId("manage-payment-info");
  });

  it("renders `Payment Info` form", async () => {
    const { findByTestId } = render(<ManagePaymentInfo />, { wrapper });

    await findByTestId("manage-payment-form");
  });

  it("renders loaded Company info in the `Payment Info` form", async () => {
    const { getByTestId, findByTestId } = render(<ManagePaymentInfo />, {
      wrapper
    });

    await findByTestId("manage-payment-form");
    const { address } = company;
    const countryName = getCountryByCode(address.country)!.name;
    expect(getInput(getByTestId("email-input"))).toHaveAttribute("value", company.email);
    expect(getInput(getByTestId("phone-input"))).toHaveAttribute("value", address.phone);
    expect(getInput(getByTestId("name-input"))).toHaveAttribute("value", company.name);
    expect(getInput(getByTestId("street1-input"))).toHaveAttribute(
      "value",
      address.street1
    );
    expect(getInput(getByTestId("city-input"))).toHaveAttribute("value", address.city);
    expect(getInput(getByTestId("region-input"))).toHaveAttribute(
      "value",
      address.region
    );
    expect(getInput(getByTestId("postal-code-input"))).toHaveAttribute(
      "value",
      address.postalCode
    );
    // autocomplete seems to have some miliseconds of delay before 'value' is set
    await waitFor(() => {
      expect(getInput(getByTestId("country-input"))).toHaveAttribute(
        "value",
        countryName
      );
    });
  });

  describe("Permissions", () => {
    it("doesn't redirect away an Org Admin", async () => {
      history.push("/settings/subscription/payment/edit");
      const { findByTestId } = render(<ManagePaymentInfo />, { wrapper });

      await findByTestId("manage-payment-form");
      expect(history.location.pathname).toEqual("/settings/subscription/payment/edit");
    });

    it("automatically redirects an Admin away due to insufficient permissions", async () => {
      currentUser = { ...mockAdmin };
      history.push("/settings/subscription/payment/edit");
      render(<ManagePaymentInfo />, { wrapper });

      await waitFor(() => {
        expect(history.location.pathname).toEqual("/");
      });
    });

    it("automatically redirects a Viewer away due to insufficient permissions", async () => {
      currentUser = { ...mockViewer };
      history.push("/settings/subscription/payment/edit");
      render(<ManagePaymentInfo />, { wrapper });

      await waitFor(() => {
        expect(history.location.pathname).toEqual("/");
      });
    });
  });
});

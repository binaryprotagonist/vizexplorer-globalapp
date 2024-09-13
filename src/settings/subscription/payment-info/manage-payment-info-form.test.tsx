import { produce } from "immer";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { ThemeProvider } from "../../../theme";
import { createMemoryHistory, History } from "history";
import { Route, Router, Routes } from "react-router-dom";
import { ManagePaymentInfoForm } from "./manage-payment-info-form";
import { MockedProvider } from "@apollo/client/testing";
import { mockCompany, mockCompanyUpdate } from "../../../view/testing/mocks";
import { getInput, updateInput } from "../../../view/testing";
import { InMemoryCache } from "@apollo/client";
import { getCountryByCode } from "../../../view/utils/country";
import { GaCompanyFragment, GaCompanyFragmentDoc } from "generated-graphql";

describe("<ManagePaymentInfoForm />", () => {
  let history: History;
  let company: GaCompanyFragment;
  let companyUpdate: GaCompanyFragment;
  const cache = new InMemoryCache();

  beforeEach(() => {
    company = { ...mockCompany };
    companyUpdate = { ...mockCompany };
    history = createMemoryHistory({
      initialEntries: ["/settings/subscription/payment/edit"]
    });
    // set initial company information in cache pre-update
    cache.restore({
      [`${cache.identify(company)}`]: {
        ...company
      }
    });
  });

  function wrapper({ children }: any) {
    return (
      <ThemeProvider>
        <MockedProvider
          cache={cache}
          mocks={[
            mockCompanyUpdate(companyUpdate),
            mockCompanyUpdate(
              { ...companyUpdate, name: "name-taken" },
              "company name already exists"
            )
          ]}
        >
          <Router navigator={history} location={history.location}>
            <Routes>
              <Route path={"/settings/subscription/*"}>
                <Route path={"payment/edit"} element={children} />
              </Route>
            </Routes>
          </Router>
        </MockedProvider>
      </ThemeProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(<ManagePaymentInfoForm company={company} />, {
      wrapper
    });

    expect(getByTestId("manage-payment-form")).toBeInTheDocument();
  });

  it("renders form fields", () => {
    const { getByTestId } = render(<ManagePaymentInfoForm company={company} />, {
      wrapper
    });

    expect(getByTestId("email-input")).toBeInTheDocument();
    expect(getByTestId("phone-input")).toBeInTheDocument();
    expect(getByTestId("name-input")).toBeInTheDocument();
    expect(getByTestId("street1-input")).toBeInTheDocument();
    expect(getByTestId("city-input")).toBeInTheDocument();
    expect(getByTestId("region-input")).toBeInTheDocument();
    expect(getByTestId("postal-code-input")).toBeInTheDocument();
    expect(getByTestId("country-input")).toBeInTheDocument();
  });

  it("renders company information", () => {
    const { getByTestId } = render(<ManagePaymentInfoForm company={company} />, {
      wrapper
    });

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
    expect(getInput(getByTestId("country-input"))).toHaveAttribute("value", countryName);
  });

  it("defaults country to US if provided country is invalid", () => {
    company = produce(mockCompany, (draft) => {
      draft.address.country = "ABCD";
    });
    const { getByTestId } = render(<ManagePaymentInfoForm company={company} />, {
      wrapper
    });

    expect(getInput(getByTestId("country-input"))).toHaveAttribute(
      "value",
      "United States"
    );
  });

  it("redirects user upon clicking `Cancel`", () => {
    const { getByText } = render(<ManagePaymentInfoForm company={company} />, {
      wrapper
    });

    fireEvent.click(getByText("Cancel"));
    expect(history.location.pathname).toEqual("/settings/subscription");
  });

  it("redirects user upon successful Update", async () => {
    companyUpdate = { ...mockCompany, name: "New Company Name" };
    const { getByTestId, getByText } = render(
      <ManagePaymentInfoForm company={company} />,
      { wrapper }
    );

    updateInput(getByTestId("name-input"), companyUpdate.name);
    fireEvent.click(getByText("Submit"));

    await waitFor(() => {
      expect(history.location.pathname).toEqual("/settings/subscription");
    });
  });

  it("updates Company information stored in cache", async () => {
    companyUpdate = { ...mockCompany, name: "New Company Name" };
    const { getByText, getByTestId } = render(
      <ManagePaymentInfoForm company={company} />,
      { wrapper }
    );

    const preUpdate = cache.readFragment({
      id: cache.identify(company),
      fragment: GaCompanyFragmentDoc,
      fragmentName: "GaCompany"
    });
    expect((preUpdate as GaCompanyFragment).name).toEqual(company.name);

    updateInput(getByTestId("name-input"), companyUpdate.name);
    fireEvent.click(getByText("Submit"));

    await waitFor(() => {
      const postUpdate = cache.readFragment({
        id: cache.identify(company),
        fragment: GaCompanyFragmentDoc,
        fragmentName: "GaCompany"
      });
      expect((postUpdate as GaCompanyFragment).name).toEqual(companyUpdate.name);
    });
  });

  it("can update Company with blank fields for non-required fields", async () => {
    companyUpdate = {
      ...mockCompany,
      address: {
        ...mockCompany.address,
        street1: "",
        postalCode: "",
        city: "",
        region: ""
      }
    };
    const { getByText, getByTestId } = render(
      <ManagePaymentInfoForm company={company} />,
      { wrapper }
    );

    updateInput(getByTestId("street1-input"), "");
    updateInput(getByTestId("postal-code-input"), "");
    updateInput(getByTestId("city-input"), "");
    updateInput(getByTestId("region-input"), "");
    fireEvent.click(getByText("Submit"));

    await waitFor(() => {
      expect(history.location.pathname).toEqual("/settings/subscription");
    });
  });

  it("disables Actions while submitting", async () => {
    const { getByText } = render(<ManagePaymentInfoForm company={company} />, {
      wrapper
    });

    expect(getByText("Submit")).toBeEnabled();
    expect(getByText("Cancel")).toBeEnabled();

    fireEvent.click(getByText("Submit"));

    await waitFor(() => {
      expect(getByText("Submit")).toBeDisabled();
      expect(getByText("Cancel")).toBeDisabled();
    });
    // wait for location change to signify submit has completed, otherwise test can leak
    await waitFor(() => {
      expect(history.location.pathname).toEqual("/settings/subscription");
    });
  });

  it("renders error if `Company Name` is set blank", async () => {
    const { getByText, getByTestId, findByText } = render(
      <ManagePaymentInfoForm company={company} />,
      {
        wrapper
      }
    );

    updateInput(getByTestId("name-input"), "");
    fireEvent.click(getByText("Submit"));

    await findByText("Company Name can't be blank");
  });

  it("renders error if `Accts. Payable Email` is set blank", async () => {
    const { getByText, getByTestId, findByText } = render(
      <ManagePaymentInfoForm company={company} />,
      { wrapper }
    );

    updateInput(getByTestId("email-input"), "");
    fireEvent.click(getByText("Submit"));

    await findByText("Accounts Payable Email can't be blank");
    expect(history.location.pathname).toEqual("/settings/subscription/payment/edit");
  });

  it("renders error if `Accts. Payable Email` is provided an invalid email format", async () => {
    const { getByText, getByTestId, findByText } = render(
      <ManagePaymentInfoForm company={company} />,
      { wrapper }
    );

    updateInput(getByTestId("email-input"), "invalid_email");
    fireEvent.click(getByText("Submit"));

    await findByText("Invalid email address");
    expect(history.location.pathname).toEqual("/settings/subscription/payment/edit");
  });

  it("renders error if `Accts. Payable Phone` is set blank", async () => {
    const { getByText, getByTestId, findByText } = render(
      <ManagePaymentInfoForm company={company} />,
      { wrapper }
    );

    updateInput(getByTestId("phone-input"), "");
    fireEvent.click(getByText("Submit"));

    await findByText("Accounts Payable Phone can't be blank");
    expect(history.location.pathname).toEqual("/settings/subscription/payment/edit");
  });

  it("renders error if `Country` is set blank", async () => {
    const { getByText, getByTestId, findByText } = render(
      <ManagePaymentInfoForm company={company} />,
      { wrapper }
    );

    updateInput(getByTestId("country-input"), "");
    fireEvent.click(getByText("Submit"));

    await findByText("Country can't be blank");
    expect(history.location.pathname).toEqual("/settings/subscription/payment/edit");
  });

  it("renders company name taken error if returned from the API", async () => {
    const { getByText, getByTestId } = render(
      <ManagePaymentInfoForm company={company} />,
      { wrapper }
    );

    updateInput(getByTestId("name-input"), "name-taken");
    fireEvent.click(getByText("Submit"));

    await waitFor(() => {
      const nameField = getByTestId("name-input");
      expect(nameField).toHaveTextContent("Company name taken");
    });
    expect(history.location.pathname).toEqual("/settings/subscription/payment/edit");
  });
});

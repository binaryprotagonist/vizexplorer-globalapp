import { act, fireEvent, render } from "@testing-library/react";
import { ThemeProvider } from "../../../theme";
import { PaymentInfo } from "./payment-info";
import {
  mockOrgAdmin,
  mockAdmin,
  mockViewer,
  mockCompany
} from "../../../view/testing/mocks";
import { createMemoryHistory, History } from "history";
import { Router } from "react-router-dom";

describe("<PaymentInfo />", () => {
  let history: History = null as any;

  beforeEach(() => {
    jest.useFakeTimers();
    history = createMemoryHistory();
  });

  function wrapper({ children }: any) {
    return (
      <ThemeProvider>
        <Router navigator={history} location={history.location}>
          {children}
        </Router>
      </ThemeProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(
      <PaymentInfo company={mockCompany} currentUser={mockOrgAdmin} />,
      { wrapper }
    );

    expect(getByTestId("payment-info")).toBeInTheDocument();
  });

  it("renders company payment information", () => {
    const { getByText } = render(
      <PaymentInfo company={mockCompany} currentUser={mockOrgAdmin} />,
      { wrapper }
    );

    const { address } = mockCompany;
    expect(getByText("Acct. Payable Email")).toBeInTheDocument();
    expect(getByText(mockCompany.email)).toBeInTheDocument();
    expect(getByText("Acct. Payable Phone")).toBeInTheDocument();
    expect(getByText(address.phone)).toBeInTheDocument();
    expect(getByText("Company Name")).toBeInTheDocument();
    expect(getByText(mockCompany.name)).toBeInTheDocument();
    expect(getByText("Address")).toBeInTheDocument();
    expect(getByText(address.street1, { exact: false })).toBeInTheDocument();
    expect(getByText(address.city, { exact: false })).toBeInTheDocument();
    expect(getByText(address.region, { exact: false })).toBeInTheDocument();
    expect(getByText(address.country, { exact: false })).toBeInTheDocument();
    expect(getByText(address.postalCode, { exact: false })).toBeInTheDocument();
  });

  it("renders `Manage Payment Info` button", () => {
    const { getByTestId } = render(
      <PaymentInfo company={mockCompany} currentUser={mockOrgAdmin} />,
      { wrapper }
    );

    expect(getByTestId("manage-payment-info")).toBeInTheDocument();
  });

  it("navigates the user if `Manage Payment Info` is clicked", () => {
    const { getByTestId } = render(
      <PaymentInfo company={mockCompany} currentUser={mockOrgAdmin} />,
      { wrapper }
    );

    fireEvent.click(getByTestId("manage-payment-info"));
    expect(history.location.pathname).toEqual("/payment/edit");
  });

  it("disables `Manage Payment Info` for Admin users", () => {
    const { getByTestId } = render(
      <PaymentInfo company={mockCompany} currentUser={mockAdmin} />,
      { wrapper }
    );

    fireEvent.click(getByTestId("manage-payment-info"));
    expect(history.location.pathname).toEqual("/");
    expect(getByTestId("manage-payment-info")).toBeDisabled();
  });

  it("disables `Manage Payment Info` for Viewer users", () => {
    const { getByTestId } = render(
      <PaymentInfo company={mockCompany} currentUser={mockViewer} />,
      { wrapper }
    );

    fireEvent.click(getByTestId("manage-payment-info"));
    expect(history.location.pathname).toEqual("/");
    expect(getByTestId("manage-payment-info")).toBeDisabled();
  });

  it("renders tooltip if `Manage Payment Info` is disabled due to lack of permissions", () => {
    const { getByTestId, getByText, getByRole } = render(
      <PaymentInfo company={mockCompany} currentUser={mockViewer} />,
      { wrapper }
    );

    act(() => {
      fireEvent.mouseOver(getByTestId("manage-payment-info"));
      jest.runAllTimers();
    });

    expect(getByRole("tooltip")).toBeInTheDocument();
    expect(getByText("You don't have permission", { exact: false }));
  });

  it("doesn't render tooltip if `Manage Payment Info` is enabled", () => {
    const { queryByRole, getByTestId } = render(
      <PaymentInfo company={mockCompany} currentUser={mockOrgAdmin} />,
      { wrapper }
    );

    act(() => {
      fireEvent.mouseOver(getByTestId("manage-payment-info"));
      jest.runAllTimers();
    });

    expect(queryByRole("tooltip")).not.toBeInTheDocument();
  });
});

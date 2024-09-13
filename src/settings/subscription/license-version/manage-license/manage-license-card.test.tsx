import { fireEvent, render, waitFor } from "@testing-library/react";
import { ManageLicenseCard } from "./manage-license-card";
import { History, createMemoryHistory } from "history";
import { ThemeProvider } from "../../../../theme";
import { Router } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing";
import { updateInput } from "../../../../view/testing";
import {
  mockKey,
  mockLicenseUpdate,
  mockLicenseValidateQuery
} from "./__mocks__/manage-license-card";
import { ManageLicenseLicenseStatusFragment } from "./__generated__/manage-license-card";

describe("<ManageLicenseCard />", () => {
  let history: History;
  let curLicenseStatus: ManageLicenseLicenseStatusFragment;
  let licenseValidate: ManageLicenseLicenseStatusFragment;

  beforeEach(() => {
    history = createMemoryHistory();
    curLicenseStatus = {
      isValid: false
    };
    licenseValidate = {
      isValid: true
    };
  });

  function wrapper({ children }: any) {
    return (
      <MockedProvider
        mocks={[
          mockLicenseUpdate(mockKey),
          mockLicenseValidateQuery(mockKey, licenseValidate)
        ]}
      >
        <ThemeProvider>
          <Router navigator={history} location={history.location}>
            {children}
          </Router>
        </ThemeProvider>
      </MockedProvider>
    );
  }

  it("renders", () => {
    const { getByTestId } = render(<ManageLicenseCard status={curLicenseStatus} />, {
      wrapper
    });

    expect(getByTestId("manage-license-card")).toBeInTheDocument();
  });

  it("renders expected messaging if no license has been activated", () => {
    const { getByText } = render(<ManageLicenseCard status={curLicenseStatus} />, {
      wrapper
    });

    expect(getByText("Enter your License Key")).toBeInTheDocument();
  });

  it("renders expected messaging if a license has been activated", () => {
    curLicenseStatus.isValid = true;
    const { getByText } = render(<ManageLicenseCard status={curLicenseStatus} />, {
      wrapper
    });

    expect(getByText("Your license is")).toBeInTheDocument();
    expect(getByText("Active!")).toBeInTheDocument();
  });

  it("renders expected actions if no license has been activated", () => {
    const { queryByText, getByText } = render(
      <ManageLicenseCard status={curLicenseStatus} />,
      { wrapper }
    );

    expect(queryByText("Back")).not.toBeInTheDocument();
    expect(queryByText("Update")).not.toBeInTheDocument();
    expect(getByText("Activate")).toBeInTheDocument();
  });

  it("renders expected actions if a license has been activated", () => {
    curLicenseStatus.isValid = true;
    const { getByText, queryByText } = render(
      <ManageLicenseCard status={curLicenseStatus} />,
      { wrapper }
    );

    expect(queryByText("Activate")).not.toBeInTheDocument();
    expect(getByText("Back")).toBeInTheDocument();
    expect(getByText("Update")).toBeInTheDocument();
  });

  it("renders error if the license is expired", () => {
    curLicenseStatus = {
      isValid: true,
      error: {
        __typename: "LicenseError",
        code: "expired"
      }
    };
    const { getByText } = render(<ManageLicenseCard status={curLicenseStatus} />, {
      wrapper
    });

    expect(getByText("License validation failed", { exact: false }));
    expect(getByText("our license has expired", { exact: false }));
  });

  it("enables submit button if a valid key is entered", async () => {
    const { getByTestId, findByTestId } = render(
      <ManageLicenseCard status={curLicenseStatus} />,
      { wrapper }
    );

    updateInput(getByTestId("license-input"), mockKey);

    await findByTestId("adornment-valid");
    expect(getByTestId("license-submit-btn")).toBeEnabled();
  });

  it("disables submit button if an invalid key is entered", async () => {
    licenseValidate = { isValid: false };
    const { getByTestId, findByTestId } = render(
      <ManageLicenseCard status={curLicenseStatus} />,
      { wrapper }
    );

    updateInput(getByTestId("license-input"), mockKey);

    await findByTestId("adornment-invalid");
    expect(getByTestId("license-submit-btn")).toBeDisabled();
  });

  it("disables the submit button if an invalid length key is entered", async () => {
    const { getByTestId } = render(<ManageLicenseCard status={curLicenseStatus} />, {
      wrapper
    });

    updateInput(getByTestId("license-input"), "AAAA - AAAA");

    await waitFor(() => {
      expect(getByTestId("license-submit-btn")).toBeDisabled();
    });
  });

  it("disables the submit button if the user changes the license key after entering a valid key", async () => {
    const { getByTestId, findByTestId } = render(
      <ManageLicenseCard status={curLicenseStatus} />,
      { wrapper }
    );

    updateInput(getByTestId("license-input"), mockKey);
    await findByTestId("adornment-valid");

    updateInput(getByTestId("license-input"), "AAAA - AAAA");
    await waitFor(() => {
      expect(getByTestId("license-submit-btn")).toBeDisabled();
    });
  });

  it("disables submit while no key has been entered", () => {
    const { getByTestId } = render(<ManageLicenseCard status={curLicenseStatus} />, {
      wrapper
    });

    expect(getByTestId("license-submit-btn")).toBeDisabled();
  });

  it("disables submit while validating validating entered license key", () => {
    const { getByTestId } = render(<ManageLicenseCard status={curLicenseStatus} />, {
      wrapper
    });

    updateInput(getByTestId("license-input"), mockKey);

    expect(getByTestId("license-submit-btn")).toBeDisabled();
  });

  it("disables submit while activating a license key", async () => {
    delete (window as any).location;
    window.location = {
      href: "http://localhost/settings/license/manage"
    } as any;
    const { getByTestId, findByTestId } = render(
      <ManageLicenseCard status={curLicenseStatus} />,
      { wrapper }
    );

    updateInput(getByTestId("license-input"), mockKey);

    await findByTestId("adornment-valid");
    fireEvent.click(getByTestId("license-submit-btn"));

    expect(getByTestId("license-submit-btn")).toBeDisabled();
    // location change signals submit is finished, otherwise it can leak into other tests
    await waitFor(() => {
      expect(window.location.href).toEqual("/");
    });
  });

  it("redirects the user Home upon successful activation of License", async () => {
    delete (window as any).location;
    window.location = {
      href: "http://localhost/settings/license/manage"
    } as any;
    history.push("/settings/license/manage");

    const { getByTestId, findByTestId } = render(
      <ManageLicenseCard status={curLicenseStatus} />,
      { wrapper }
    );

    updateInput(getByTestId("license-input"), mockKey);
    await findByTestId("adornment-valid");

    fireEvent.click(getByTestId("license-submit-btn"));

    // If `prevPage` state isn't passed to the route, window location should change on license activation
    // Check window location changed in this case but the router history remained the same
    await waitFor(() => {
      expect(window.location.href).toEqual("/");
    });
    expect(history.location.pathname).toEqual("/settings/license/manage");
  });

  it("redirects the user to `prevPage` if provided upon successful activation of License", async () => {
    delete (window as any).location;
    window.location = {
      href: "http://localhost/settings/license/manage"
    } as any;
    history.push("/settings/license/manage", { prevPage: "/settings/users" });

    const { getByTestId, findByTestId } = render(
      <ManageLicenseCard status={curLicenseStatus} />,
      { wrapper }
    );

    updateInput(getByTestId("license-input"), mockKey);
    await findByTestId("adornment-valid");

    fireEvent.click(getByTestId("license-submit-btn"));

    // If `prevPage` state is passed to the route, router location should change on license activation
    // Check router location has changed in this case but the window location remained the same
    await waitFor(() => {
      expect(history.location.pathname).toEqual("/settings/users");
    });
    expect(window.location.href).toEqual("http://localhost/settings/license/manage");
  });
});

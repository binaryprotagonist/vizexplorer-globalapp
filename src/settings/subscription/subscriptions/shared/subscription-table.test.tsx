import { fireEvent, render } from "@testing-library/react";
import { SubscriptionTable } from "./subscription-table";
import {
  generateDummyAppSubscriptions,
  mockAdmin,
  mockOrgAdmin,
  mockViewer
} from "../../../../view/testing/mocks";
import { ThemeProvider } from "../../../../theme";
import { produce } from "immer";

const appSubs = generateDummyAppSubscriptions(2);
appSubs[1].subscription!.package = "premium";

function wrapper({ children }: any) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("<SubscriptionTable />", () => {
  it("renders", () => {
    const { getByTestId } = render(
      <SubscriptionTable
        currentUser={mockOrgAdmin}
        appSubscriptions={appSubs}
        companyName={""}
      />,
      { wrapper }
    );

    expect(getByTestId("subscription-table")).toBeInTheDocument();
  });

  it("renders title including the company name", () => {
    const companyName = "Test Company";
    const { getByText } = render(
      <SubscriptionTable
        currentUser={mockOrgAdmin}
        appSubscriptions={appSubs}
        companyName={companyName}
      />,
      { wrapper }
    );

    expect(getByText(`${companyName} Subscriptions`)).toBeInTheDocument();
  });

  it("renders application names", () => {
    const { getByText } = render(
      <SubscriptionTable
        currentUser={mockOrgAdmin}
        appSubscriptions={appSubs}
        companyName={""}
      />,
      { wrapper }
    );

    expect(getByText(appSubs[0].name)).toBeInTheDocument();
    expect(getByText(appSubs[1].name)).toBeInTheDocument();
  });

  it("renders formatted application Packages", () => {
    const { getByText } = render(
      <SubscriptionTable
        currentUser={mockOrgAdmin}
        appSubscriptions={appSubs}
        companyName={""}
      />,
      { wrapper }
    );

    expect(getByText("Standard")).toBeInTheDocument();
    expect(getByText("Premium")).toBeInTheDocument();
  });

  it("renders formatted Environments", () => {
    const mixedEnvApps = produce(appSubs, (draft) => {
      // draft[0] is cloud
      draft[1].subscription!.isOnprem = true;
    });
    const { getByText } = render(
      <SubscriptionTable
        currentUser={mockOrgAdmin}
        appSubscriptions={mixedEnvApps}
        companyName={""}
      />,
      { wrapper }
    );

    expect(getByText("Cloud")).toBeInTheDocument();
    expect(getByText("On-Premises")).toBeInTheDocument();
  });

  it("renders formatted application Start/End dates", () => {
    const { getByText } = render(
      <SubscriptionTable
        currentUser={mockOrgAdmin}
        appSubscriptions={appSubs}
        companyName={""}
      />,
      { wrapper }
    );

    // app 1 start/end 2021-02-01
    expect(getByText("Feb 01, 2021")).toBeInTheDocument();
    expect(getByText("Feb 11, 2022")).toBeInTheDocument();
    // app 2 start/end
    expect(getByText("Feb 02, 2021")).toBeInTheDocument();
    expect(getByText("Feb 12, 2022")).toBeInTheDocument();
  });

  it("renders formatted application Status", () => {
    const { getAllByText } = render(
      <SubscriptionTable
        currentUser={mockOrgAdmin}
        appSubscriptions={appSubs}
        companyName={""}
      />,
      { wrapper }
    );

    expect(getAllByText("Active")).toHaveLength(2);
  });

  it("renders actions for each App Subscription", () => {
    const { getAllByText } = render(
      <SubscriptionTable
        currentUser={mockOrgAdmin}
        appSubscriptions={appSubs}
        companyName={""}
      />,
      { wrapper }
    );

    expect(getAllByText("Edit")).toHaveLength(appSubs.length);
    expect(getAllByText("Cancel")).toHaveLength(appSubs.length);
  });

  describe("Permissions", () => {
    const mockWindowOpen = (window.open = jest.fn());

    beforeEach(() => {
      mockWindowOpen.mockClear();
    });

    it("allows `OrgAdmin` to click Edit", () => {
      const { getAllByText } = render(
        <SubscriptionTable
          currentUser={mockOrgAdmin}
          appSubscriptions={appSubs}
          companyName={""}
        />,
        { wrapper }
      );

      fireEvent.click(getAllByText("Edit")[0]);
      expect(window.open).toHaveBeenCalled();
    });

    it("allows `OrgAdmin` to click Cancel", () => {
      const { getAllByText } = render(
        <SubscriptionTable
          currentUser={mockOrgAdmin}
          appSubscriptions={appSubs}
          companyName={""}
        />,
        { wrapper }
      );

      fireEvent.click(getAllByText("Cancel")[0]);
      expect(window.open).toHaveBeenCalled();
    });

    it("doesn't allow `Admin` to click Edit", () => {
      const { getAllByText } = render(
        <SubscriptionTable
          currentUser={mockAdmin}
          appSubscriptions={appSubs}
          companyName={""}
        />,
        { wrapper }
      );

      fireEvent.click(getAllByText("Edit")[0]);
      expect(window.open).not.toHaveBeenCalled();
    });

    it("doesn't allow `Admin` to click Cancel", () => {
      const { getAllByText } = render(
        <SubscriptionTable
          currentUser={mockAdmin}
          appSubscriptions={appSubs}
          companyName={""}
        />,
        { wrapper }
      );

      fireEvent.click(getAllByText("Cancel")[0]);
      expect(window.open).not.toHaveBeenCalled();
    });

    it("doesn't allow `Viewer` to click Edit", () => {
      const { getAllByText } = render(
        <SubscriptionTable
          currentUser={mockViewer}
          appSubscriptions={appSubs}
          companyName={""}
        />,
        { wrapper }
      );

      fireEvent.click(getAllByText("Edit")[0]);
      expect(window.open).not.toHaveBeenCalled();
    });

    it("doesn't allow `Viewer` to click Cancel", () => {
      const { getAllByText } = render(
        <SubscriptionTable
          currentUser={mockViewer}
          appSubscriptions={appSubs}
          companyName={""}
        />,
        { wrapper }
      );

      fireEvent.click(getAllByText("Cancel")[0]);
      expect(window.open).not.toHaveBeenCalled();
    });
  });
});

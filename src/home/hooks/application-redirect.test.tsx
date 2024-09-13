import { render, waitFor } from "@testing-library/react";
import {
  OrgAppFragment,
  generateDummyOrgApps,
  LAST_ACCESSED_APP,
  MockAuthProvider,
  MockGraphQLProvider,
  MockRecoilProvider
} from "@vizexplorer/global-ui-core";
import { useApplicationRedirect } from "./application-redirect";
import { mockCurrentUserQuery } from "testing/mocks";

function Test() {
  const { attemptingRedirect } = useApplicationRedirect();
  return <>redirecting: {attemptingRedirect.toString()}</>;
}

describe("useApplicationRedirect", () => {
  const defaultUrl = "http://localhost/";
  let orgApps: OrgAppFragment[] = [];

  beforeEach(() => {
    orgApps = generateDummyOrgApps(3);
    delete (window as any).location;
    window.location = {
      href: defaultUrl,
      pathname: "/"
    } as any;
    localStorage.clear();
  });

  function wrapper({ children }: any) {
    return (
      <MockAuthProvider>
        <MockRecoilProvider>
          <MockGraphQLProvider mockData={{ orgApps }} mocks={[mockCurrentUserQuery()]}>
            {children}
          </MockGraphQLProvider>
        </MockRecoilProvider>
      </MockAuthProvider>
    );
  }

  it("immediately attempts to redirect the user", async () => {
    const { getByText } = render(<Test />, { wrapper });
    expect(getByText("redirecting: true")).toBeInTheDocument();
    await waitFor(() => {});
  });

  it("redirects if a valid app has been previously accessed", async () => {
    localStorage.setItem(LAST_ACCESSED_APP, orgApps[0].id);
    const { getByText } = render(<Test />, { wrapper });

    await waitFor(() => expect(window.location.href).toEqual(orgApps[0].url));
    expect(getByText("redirecting: true")).toBeInTheDocument();
  });

  it("doesn't redirect if the previous app accessed doesn't exist", async () => {
    localStorage.setItem(LAST_ACCESSED_APP, "_invalid_");
    const { getByText } = render(<Test />, { wrapper });

    await waitFor(() => expect(getByText("redirecting: false")).toBeInTheDocument());
    expect(window.location.href).toEqual(defaultUrl);
  });

  it("doesn't redirect if the previous app accessed has an expired subscription", async () => {
    orgApps[0].isValid = false;
    localStorage.setItem(LAST_ACCESSED_APP, orgApps[0].id);
    const { getByText } = render(<Test />, { wrapper });

    await waitFor(() => expect(getByText("redirecting: false")).toBeInTheDocument());
    expect(window.location.href).toEqual(defaultUrl);
  });

  it("doesn't redirect if the current user doesn't have access to the previously accessed app", async () => {
    localStorage.setItem(LAST_ACCESSED_APP, orgApps[0].id);
    orgApps[0].hasAccess = false;
    const { getByText } = render(<Test />, { wrapper });

    await waitFor(() => expect(getByText("redirecting: false")).toBeInTheDocument());
    expect(window.location.href).toEqual(defaultUrl);

    localStorage.removeItem(LAST_ACCESSED_APP);
  });

  it("redirects if there is only a single application", async () => {
    orgApps = generateDummyOrgApps(1);
    const { getByText } = render(<Test />, { wrapper });

    await waitFor(() => expect(window.location.href).toEqual(orgApps[0].url));
    expect(getByText("redirecting: true")).toBeInTheDocument();
  });

  it("doesn't redirect if there is a single application with an expired subscription", async () => {
    orgApps = generateDummyOrgApps(1);
    orgApps[0].isValid = false;
    const { getByText } = render(<Test />, { wrapper });

    await waitFor(() => expect(getByText("redirecting: false")).toBeInTheDocument());
    expect(window.location.href).toEqual(defaultUrl);
  });

  it("doesnt redirect if the current user doesn't have access to the single app", async () => {
    orgApps = generateDummyOrgApps(1);
    orgApps[0].hasAccess = false;
    const { getByText } = render(<Test />, { wrapper });

    await waitFor(() => expect(getByText("redirecting: false")).toBeInTheDocument());
    expect(window.location.href).toEqual(defaultUrl);
  });

  it("is false if there are multiple applications and no last app access record", async () => {
    const { getByText } = render(<Test />, { wrapper });

    await waitFor(() => expect(getByText("redirecting: false")).toBeInTheDocument());
    expect(window.location.href).toEqual(defaultUrl);
  });
});

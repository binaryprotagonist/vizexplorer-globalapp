import { render } from "@testing-library/react";
import { PersonalInfo } from "./personal-info";
import {
  MockRecoilProvider,
  MockGraphQLProvider,
  MockAuthProvider,
  mockUserDetailsQuery
} from "@vizexplorer/global-ui-core";
import { ThemeProvider } from "../../theme";
import { mockCurrentUserMfaQuery, mockCurrentUserQuery } from "../../view/testing/mocks";
import { BrowserRouter } from "react-router-dom";

function wrapper({ children }: any) {
  return (
    <MockRecoilProvider>
      <MockAuthProvider>
        <MockGraphQLProvider
          mocks={[
            mockCurrentUserMfaQuery(false),
            mockCurrentUserMfaQuery(false),
            mockCurrentUserQuery(),
            mockUserDetailsQuery()
          ]}
        >
          <ThemeProvider>
            <BrowserRouter>{children}</BrowserRouter>
          </ThemeProvider>
        </MockGraphQLProvider>
      </MockAuthProvider>
    </MockRecoilProvider>
  );
}

describe("<PersonalInfo />", () => {
  it("renders", () => {
    const { getByTestId } = render(<PersonalInfo />, { wrapper });

    expect(getByTestId("personal-info")).toBeInTheDocument();
  });

  it("renders Basic Info card", async () => {
    const { findByTestId } = render(<PersonalInfo />, { wrapper });

    await findByTestId("basic-info");
  });

  it("renders Security card", async () => {
    const { findByTestId } = render(<PersonalInfo />, { wrapper });

    await findByTestId("security");
  });
});

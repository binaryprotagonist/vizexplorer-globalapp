import { render } from "@testing-library/react";
import { MockAuthProvider, MockRecoilProvider } from "@vizexplorer/global-ui-core";
import { ThemeProvider } from "../../theme";
import { BasicInfoUpdate } from "./basic-info-update";
import { MockedProvider } from "../../view/testing";
import { BrowserRouter } from "react-router-dom";
import { mockCurrentUserQuery } from "testing/mocks";

function wrapper({ children }: any) {
  return (
    <MockRecoilProvider>
      <MockAuthProvider>
        <MockedProvider mocks={[mockCurrentUserQuery()]}>
          <ThemeProvider>
            <BrowserRouter>{children}</BrowserRouter>
          </ThemeProvider>
        </MockedProvider>
      </MockAuthProvider>
    </MockRecoilProvider>
  );
}

describe("<BasicInfoUpdate />", () => {
  it("renders", async () => {
    const { findByTestId } = render(<BasicInfoUpdate />, { wrapper });

    await findByTestId("basic-info-update");
  });

  it("renders Edit Profile form", async () => {
    const { findByTestId } = render(<BasicInfoUpdate />, { wrapper });

    await findByTestId("edit-profile-form");
  });
});

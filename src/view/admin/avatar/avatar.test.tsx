import { fireEvent, render } from "@testing-library/react";
import { Avatar } from "./avatar";
import { ThemeProvider } from "../../../theme";
import { UserDetails } from "@vizexplorer/global-ui-core/dist/utils/auth/types";
import { MockAuthProvider } from "@vizexplorer/global-ui-core";

const mockUser: UserDetails = {
  id: "1",
  firstName: "John",
  lastName: "Smit",
  email: "john.smith@test.com",
  username: "",
  company: ""
};

describe("Avatar", () => {
  const signOut = jest.fn();
  const getUserInfo = jest.fn().mockReturnValue(mockUser);

  beforeEach(() => {
    signOut.mockClear();
    getUserInfo.mockClear();
  });

  function wrapper({ children }: any) {
    return (
      <MockAuthProvider session={{ signOut, getUserInfo, isSignedIn: true }}>
        <ThemeProvider>{children}</ThemeProvider>
      </MockAuthProvider>
    );
  }

  it("renders", async () => {
    const { findByTestId } = render(<Avatar />, { wrapper });

    await findByTestId("admin-avatar");
  });

  it("renders provided initials", async () => {
    const { getByTestId, findByTestId } = render(<Avatar />, { wrapper });

    await findByTestId("admin-avatar");
    const avatar = getByTestId("admin-avatar");
    expect(avatar).toHaveTextContent("JS"); // John Smith
  });

  it("displays an empty string if UserDetails is null", async () => {
    getUserInfo.mockReturnValueOnce(null);
    const { getByTestId, findByTestId } = render(<Avatar />, { wrapper });

    await findByTestId("admin-avatar");
    const avatar = getByTestId("admin-avatar");
    expect(avatar).toHaveTextContent("");
  });

  it("doesn't render menu options by default", async () => {
    const { queryByTestId, findByTestId } = render(<Avatar />, { wrapper });

    await findByTestId("admin-avatar");
    expect(queryByTestId("Logout")).not.toBeInTheDocument();
  });

  it("renders `Logout`", async () => {
    const { getByTestId, getByText, findByTestId } = render(<Avatar />, {
      wrapper
    });

    await findByTestId("admin-avatar");
    fireEvent.click(getByTestId("admin-avatar"));
    expect(getByText("Logout")).toBeInTheDocument();
  });

  it("calls `signOut` when `Logout` is clicked", async () => {
    const { getByText, getByTestId, findByTestId } = render(<Avatar />, {
      wrapper
    });

    await findByTestId("admin-avatar");
    fireEvent.click(getByTestId("admin-avatar"));
    fireEvent.click(getByText("Logout"));
    expect(signOut).toHaveBeenCalledTimes(1);
  });
});

import { render } from "@testing-library/react";
import { Session } from "@vizexplorer/global-ui-core/dist/utils/auth/types";
import { Login } from ".";
import { useAuth } from "@vizexplorer/global-ui-core";
import { MemoryRouter, Route, Routes } from "react-router-dom";

jest.mock("@vizexplorer/global-ui-core");
const mockedUseAuth = jest.mocked(useAuth);

describe("<Login />", () => {
  let mockSession: Session;

  beforeEach(() => {
    mockSession = {
      isSignedIn: false,
      signIn: jest.fn(),
      getToken: jest.fn(),
      getUserInfo: jest.fn(),
      loading: true,
      signInError: null,
      signOut: jest.fn()
    };
    mockedUseAuth.mockImplementation(() => mockSession);
  });

  it("signs in if not signed in and authentication not loading", () => {
    mockedUseAuth().loading = false;
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Login />
      </MemoryRouter>
    );

    expect(mockSession.signIn).toHaveBeenCalled();
  });

  it('redirects to "/" if signed in', () => {
    mockSession.isSignedIn = true;
    mockSession.loading = false;
    const { getByTestId } = render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<div data-testid="root" />} />
        </Routes>
      </MemoryRouter>
    );

    expect(getByTestId("root")).toBeInTheDocument();
  });

  it("redirects to next route given param in URL query string", () => {
    mockSession.isSignedIn = true;
    mockSession.loading = false;
    const { getByTestId } = render(
      <MemoryRouter initialEntries={["/login?next=/dashboard"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<div data-testid="root" />} />
          <Route path="/dashboard" element={<div data-testid="dashboard" />} />
        </Routes>
      </MemoryRouter>
    );

    expect(getByTestId("dashboard")).toBeInTheDocument();
  });
});

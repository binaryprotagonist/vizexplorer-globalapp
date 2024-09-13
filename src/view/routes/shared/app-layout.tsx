import { useAuth } from "@vizexplorer/global-ui-core";
import { Outlet } from "react-router-dom";
import { Container, GuestContainer } from "../../container";

export function AppLayout() {
  return (
    <Container>
      <Outlet />
    </Container>
  );
}

/**
 * Dynamic layout based on whether the user is logged in or not
 */
export function AuthBasedLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return (
      <Container>
        <Outlet />
      </Container>
    );
  }

  return (
    <GuestContainer>
      <Outlet />
    </GuestContainer>
  );
}

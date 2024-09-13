import { useEffect } from "react";
import { useAuth } from "@vizexplorer/global-ui-core";
import { Navigate, useSearchParams } from "react-router-dom";

function GoToNext() {
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next") || "/";

  return <Navigate to={next} />;
}

export function Login() {
  const { signIn, loading, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn && !loading) {
      signIn();
    }
  }, [isSignedIn, loading, signIn]);

  if (!isSignedIn) {
    return null;
  }

  return <GoToNext />;
}

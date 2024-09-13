import { useEffect, useState } from "react";
import { useOrgApps, useApplicationStore } from "@vizexplorer/global-ui-core";
import { useCurrentUserQuery } from "generated-graphql";

// try navigate the user to an appropriate application
export function useApplicationRedirect() {
  const [attemptingRedirect, setAttemptingRedirect] = useState<boolean>(true);
  const { applications, loading: loadingApps, error: appsErr } = useOrgApps();
  const { data: curUserData, error: curUserErr } = useCurrentUserQuery();
  const { loadAppFromStore } = useApplicationStore();

  if (appsErr) throw appsErr;
  if (curUserErr) throw curUserErr;

  const currentUser = curUserData?.currentUser;
  useEffect(() => {
    if (loadingApps || !currentUser || !attemptingRedirect) return;

    async function tryRedirect() {
      const app = await loadAppFromStore();
      // try redirect to the last accessed app
      if (app?.isValid && app.hasAccess) {
        window.location.href = app.url;
        return;
        // otherwise, only auto-redirect if there is only a single valid app
      } else {
        const accessibleApps = applications.filter(({ hasAccess }) => hasAccess);
        if (accessibleApps.length === 1 && accessibleApps[0].isValid) {
          window.location.href = accessibleApps[0].url;
          return;
        }
      }

      setAttemptingRedirect(false);
    }

    tryRedirect();
  }, [loadingApps, currentUser, attemptingRedirect]);

  return {
    attemptingRedirect
  };
}

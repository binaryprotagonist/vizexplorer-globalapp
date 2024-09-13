import { useState, useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { AdminContainer } from "../../../container/admin";
import { gql, useApolloClient } from "@apollo/client";
import { AdminHeader } from "../../../header";
import { AdminAvatar } from "../../../admin/avatar";
import { ThemeProvider } from "../../../../theme";
import { Box } from "@mui/material";
import { Footer } from "@vizexplorer/global-ui-core";
import { useCurrentOrgQuery } from "./__generated__/org-route-manager";

function EmptyContainer() {
  return (
    <>
      <span data-testid={"org-routes-loading"} />
      <AdminHeader>
        <AdminAvatar />
      </AdminHeader>
      <ThemeProvider>
        <Box display={"flex"} flex={1} overflow={"hidden"} />
      </ThemeProvider>
      <Footer />
    </>
  );
}

type Params = {
  orgId: string;
};

export function OrgRouteManager() {
  const [isVerified, setIsVerified] = useState(false);
  const { orgId } = useParams() as Params;
  const navigate = useNavigate();
  const client = useApolloClient();

  const {
    data: currentOrgsData,
    loading: currentOrgsLoading,
    error: currentOrgsErr
  } = useCurrentOrgQuery();

  useEffect(() => {
    setIsVerified(false);

    if (currentOrgsLoading) return;

    if (currentOrgsData?.currentOrg?.id === orgId) {
      client.clearStore().then(() => {
        setIsVerified(true);
      });
    } else {
      navigate("..");
    }
  }, [orgId, currentOrgsLoading, currentOrgsData]);

  if (currentOrgsErr) throw currentOrgsErr;

  if (!isVerified) {
    return <EmptyContainer />;
  }

  return (
    <AdminContainer>
      <Outlet />
    </AdminContainer>
  );
}

const _ORG_SUMMARY_QUERY = gql`
  query currentOrg {
    currentOrg {
      id
    }
  }
`;

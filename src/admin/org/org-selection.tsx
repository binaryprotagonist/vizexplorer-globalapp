import { useEffect, useRef, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { OrgsTable } from "./orgs-table";
import { AdminContainer } from "../../view/container/admin";
import { Typography } from "@vizexplorer/global-ui-v2";
import { ApolloError, gql } from "@apollo/client";
import {
  OrgSearchQuery,
  useDeliveryMethodQuery,
  useOrgSearchLazyQuery,
  useOrgsQuery
} from "./__generated__/org-selection";
import { AccessOrgDetails, ActionEvt } from "./types";
import { useFnDebounce } from "../../view/utils";
import { AccessOrgDialog } from "./access-reason-dialog";
import { OrgCreate } from "./create";

export function OrgSelection() {
  const theme = useTheme();
  const [tableSearch, setTableSearch] = useState<string>("");
  const [accessOrgDetails, setAccessOrgDetails] = useState<AccessOrgDetails | null>();
  const [showAddOrg, setShowAddOrg] = useState<boolean>(false);

  const [runSearchOrgs, { orgSearchData, orgSearchLoading, orgSearchErr }] =
    useOrgSearch();
  const {
    data: orgsData,
    loading: orgsLoading,
    error: orgsErr,
    refetch: orgsRefetch
  } = useOrgsQuery();
  const {
    data: deliveryData,
    loading: deliveryMethodLoading,
    error: deliveryMethodErr
  } = useDeliveryMethodQuery();

  const isOnprem = deliveryData?.discovery?.env?.onPrem;
  const orgs = tableSearch ? orgSearchData?.orgSearch : orgsData?.orgs;

  useEffect(() => {
    if (deliveryMethodLoading || !orgsData?.orgs) return;
    if (isOnprem) {
      setAccessOrgDetails({
        orgId: orgsData.orgs[0].id,
        orgName: orgsData.orgs[0].company?.name ?? ""
      });
    }
  }, [deliveryMethodLoading, isOnprem, orgsData]);

  function handleActionClick(evt: ActionEvt) {
    switch (evt.type) {
      case "access":
        setAccessOrgDetails(evt.value);
        break;
      case "new":
        setShowAddOrg(true);
        break;
    }
  }

  function onSearchChange(search: string) {
    setTableSearch(search);
    if (search) {
      runSearchOrgs(search);
    }
  }

  if (orgsErr) throw orgsErr;
  if (orgSearchErr) throw orgSearchErr;
  if (deliveryMethodErr) throw deliveryMethodErr;

  return (
    <AdminContainer orgCtx={false}>
      {accessOrgDetails && (
        <AccessOrgDialog
          orgId={accessOrgDetails.orgId}
          orgName={accessOrgDetails.orgName}
          onClose={() => setAccessOrgDetails(null)}
        />
      )}
      {showAddOrg && (
        <OrgCreate
          onOrgCreated={() => orgsRefetch()}
          onClickAccess={(orgId, orgName) => {
            setShowAddOrg(false);
            handleActionClick({ type: "access", value: { orgId, orgName } });
          }}
          onClose={() => setShowAddOrg(false)}
        />
      )}
      <Box
        data-testid={"org-selection"}
        padding={theme.spacing(3)}
        width={"100%"}
        height={"100%"}
        overflow={"auto"}
      >
        <Box maxWidth={1200} margin={theme.spacing(5, "auto", 0, "auto")} width={"100%"}>
          <Typography variant={"h1"} fontWeight={700} mb={4}>
            Organizations
          </Typography>
          <OrgsTable
            orgs={orgs ?? []}
            searchText={tableSearch}
            disabled={orgsLoading || deliveryMethodLoading}
            loading={orgsLoading || deliveryMethodLoading || orgSearchLoading}
            showAddOrganization={isOnprem === false}
            onSearchChange={onSearchChange}
            onActionClick={handleActionClick}
          />
        </Box>
      </Box>
    </AdminContainer>
  );
}

type OrgSearchResultTuple = [
  (search: string) => void,
  {
    orgSearchData?: OrgSearchQuery;
    orgSearchLoading: boolean;
    orgSearchErr?: ApolloError;
  }
];

export function useOrgSearch(): OrgSearchResultTuple {
  const [orgSearchLoading, setOrgSearchLoading] = useState<boolean>(false);
  const searchRef = useRef<string>("");
  const debounceFn = useFnDebounce();

  const [searchOrgs, { data: orgSearchData, error: orgSearchErr }] =
    useOrgSearchLazyQuery();

  function runSearchOrgs(searchText: string) {
    searchRef.current = searchText;
    setOrgSearchLoading(true);
    debounceFn(async () => {
      await searchOrgs({ variables: { query: searchText, limit: 100 } });
      if (searchRef.current === searchText) {
        setOrgSearchLoading(false);
      }
    }, 250);
  }

  return [
    runSearchOrgs,
    {
      orgSearchData,
      orgSearchLoading,
      orgSearchErr
    }
  ];
}

const _ORGS_QUERY = gql`
  fragment OrgSummary on Org {
    id
    company {
      id
      name
      email
    }
  }

  query orgs {
    orgs {
      ...OrgSummary
    }
  }
`;

const _DELIVERY_METHOD_QUERY = gql`
  query deliveryMethod {
    discovery {
      env {
        onPrem
      }
    }
  }
`;

const _ORG_SEARCH_QUERY = gql`
  query orgSearch($query: String!, $limit: Int) {
    orgSearch(query: $query, limit: $limit) {
      ...OrgSummary
    }
  }
`;

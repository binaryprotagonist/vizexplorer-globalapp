import { Typography } from "@vizexplorer/global-ui-v2";
import { useEffect, useMemo, useState } from "react";
import { PageContainer, NoSiteSelection, SomethingWentWrong } from "view-v2/page";
import { SiteSelect, SiteSelectSiteFragment } from "view-v2/site-select";
import { useSitesQuery } from "./__generated__/marketing-lists";
import { useCurrentUserQuery } from "generated-graphql";
import { siteFromSearchParams, sitesManageableByUser } from "./utils";
import { sortArray } from "../../view/utils";
import { gql } from "@apollo/client";
import { Box, useTheme } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NoMarketingLists } from "./no-marketing-lists";

export default function MarketingLists() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<Error | null>(null);
  const [selectedSite, setSelectedSite] = useState<SiteSelectSiteFragment | null>(null);

  const {
    data: sitesData,
    loading: sitesLoading,
    refetch: refetchSites
  } = useSitesQuery({ fetchPolicy: "cache-and-network", onError: setError });
  const {
    data: curUserData,
    loading: curUserLoading,
    refetch: refetchCurUser
  } = useCurrentUserQuery({ onError: setError });

  const sites = useMemo(() => {
    if (!sitesData?.sites || !curUserData?.currentUser) return [];
    const allowedSites = sitesManageableByUser(sitesData.sites, curUserData.currentUser);
    return sortArray(allowedSites || [], true, (site) => site.name);
  }, [sitesData, curUserData]);

  const loading = sitesLoading || curUserLoading;

  useEffect(() => {
    if (sites.length !== 1) return;
    handleSiteChange(sites[0]);
  }, [sites]);

  useEffect(() => {
    const siteFromParams = siteFromSearchParams(sites, searchParams);
    if (!siteFromParams) return;
    handleSiteChange(siteFromParams);
  }, [searchParams, sites]);

  function handleSiteChange(site: SiteSelectSiteFragment) {
    setSelectedSite(site);
  }

  function handleClickNewMarketingList() {
    if (!selectedSite) return;
    navigate(`sites/${selectedSite.id}/new`);
  }

  function handleRefresh() {
    setError(null);
    refetchSites();
    refetchCurUser();
  }

  return (
    <PageContainer data-testid={"marketing-lists"}>
      <Typography variant={"h1"} fontWeight={700} mb={theme.spacing(3)}>
        Marketing Lists
      </Typography>

      {error && <SomethingWentWrong onClickRefresh={handleRefresh} />}

      {!error && (
        <Box>
          {(selectedSite || !loading) && sites.length > 1 && (
            <SiteSelect
              selected={selectedSite}
              sites={sites}
              onChange={handleSiteChange}
            />
          )}

          {!loading && !selectedSite && (
            <NoSiteSelection requiredFor={"marketing lists"} />
          )}

          {!!selectedSite && (
            <NoMarketingLists onClickCreate={handleClickNewMarketingList} />
          )}
        </Box>
      )}
    </PageContainer>
  );
}

const _SITES_QUERY = gql`
  query sites {
    sites {
      ...SiteSelectSite
    }
  }
  ${SiteSelect.fragments.siteSelectSite}
`;

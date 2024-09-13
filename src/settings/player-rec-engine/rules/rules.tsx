import { useEffect, useMemo, useState } from "react";
import { Autocomplete, Box, TextField, Typography, useTheme } from "@mui/material";
import {
  SiteFragment,
  useCurrentUserQuery,
  useGetSitesQuery,
  usePdreRulesLazyQuery
} from "generated-graphql";
import { Card, PlainCardHeader } from "../../../view/card";
import { PdreRulesTable } from "./rules-table";
import { sortArray } from "../../../view/utils";

export function PdreRules() {
  const theme = useTheme();
  const {
    data: curUserData,
    loading: curUserLoading,
    error: curUserErr
  } = useCurrentUserQuery();
  const { data: sitesData, loading: sitesLoading, error: sitesErr } = useGetSitesQuery();
  const [selectedSite, setSelectedSite] = useState<SiteFragment | null>(null);
  const [
    loadRules,
    { data: rulesData, loading: rulesLoading, error: rulesErr, called: rulesCalled }
  ] = usePdreRulesLazyQuery();

  const currentUser = curUserData?.currentUser;
  const sortedSites = useMemo(
    () => sortArray(sitesData?.sites || [], true, (site) => site.name),
    [sitesData]
  );

  useEffect(() => {
    if (selectedSite || !sortedSites.length) return;
    setSelectedSite(sortedSites[0]);
  }, [sortedSites]);

  useEffect(() => {
    if (!selectedSite) return;
    loadRules({ variables: { siteId: selectedSite.id.toString() } });
  }, [selectedSite]);

  if (sitesErr) throw sitesErr;
  if (rulesErr) throw rulesErr;
  if (curUserErr) throw curUserErr;

  return (
    <>
      <span data-testid={"pdre-rules"} />
      <Card>
        <PlainCardHeader>
          <Typography variant={"h6"}>Player Recommendation Rules</Typography>
        </PlainCardHeader>
        <Box>
          <Autocomplete
            data-testid={"pdre-rules-site-dropdown"}
            // @ts-ignore allow null value
            value={selectedSite}
            options={sortedSites || []}
            onChange={(_e, site) => setSelectedSite(site)}
            renderInput={(params) => <TextField {...params} />}
            size={"small"}
            getOptionLabel={(site) => site?.name || ""}
            isOptionEqualToValue={(option, site) => option.id === site.id}
            disableClearable
            sx={{
              width: 300,
              height: 40,
              transform: "scale(1)",
              transformOrigin: "0 0",
              paddingLeft: theme.spacing(3)
            }}
          />
          <PdreRulesTable
            currentUser={currentUser || null}
            site={selectedSite}
            rules={rulesData?.pdreRules || []}
            loading={
              sitesLoading ||
              rulesLoading ||
              curUserLoading ||
              (!!sortedSites.length && !rulesCalled)
            }
          />
        </Box>
      </Card>
    </>
  );
}

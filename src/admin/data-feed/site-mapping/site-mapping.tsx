import { useState } from "react";
import { Box, Skeleton } from "@mui/material";
import { SiteMappingTable } from "./site-mapping-table";
import {
  SiteMappingFragment,
  useDataFeedSourceSiteIdsQuery,
  useOrgSitesMappingQuery
} from "generated-graphql";
import { SiteMappingDialog } from "./site-mapping-dialog";
import { filterUsedSourceSites } from "./utils";
import { Card } from "../../../view/card";

export function SiteMapping() {
  const [editMapping, setEditMapping] = useState<SiteMappingFragment | null>();
  const {
    data: siteMapping,
    loading: siteMappingLoading,
    error: siteMappingErr
  } = useOrgSitesMappingQuery();
  const {
    data: sourceSites,
    loading: sourceSitesLoading,
    error: sourceSitesErr
  } = useDataFeedSourceSiteIdsQuery();

  if (siteMappingErr) throw siteMappingErr;
  if (sourceSitesErr) throw sourceSitesErr;

  const loading = siteMappingLoading || sourceSitesLoading;

  return (
    <Card data-testid={"site-mapping"}>
      {!!editMapping && (
        <SiteMappingDialog
          siteMapping={editMapping}
          sourceSiteIds={filterUsedSourceSites(
            sourceSites?.dataFeedStatus?.sourceSiteIds || [],
            editMapping,
            siteMapping?.org?.sites || []
          )}
          onClose={() => setEditMapping(null)}
        />
      )}
      <Box>
        {loading && <TableSkeleton />}
        {!loading && siteMapping?.org?.sites && (
          <SiteMappingTable
            siteMapping={siteMapping.org.sites}
            onClickEdit={setEditMapping}
          />
        )}
      </Box>
    </Card>
  );
}

function TableSkeleton() {
  return (
    <Box mt={"12px"} padding={"12px"}>
      <Skeleton
        variant={"rectangular"}
        width={260}
        height={40}
        sx={{ margin: "0 18px 18px auto" }}
      />
      <Skeleton variant={"rectangular"} width={"100%"} height={200} />
    </Box>
  );
}
